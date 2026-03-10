import { useEffect, useState } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Table from '@/Components/UI/Table';
import Modal from '@/Components/UI/Modal';
import Badge from '@/Components/UI/Badge';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import type { Empresa, Local, PageProps, Rol, User } from '@/types';

interface Props extends PageProps {
    usuarios: User[];
    empresas: Empresa[];
    locales: Local[];
    roles: Rol[];
}

type FormData = {
    empresa_id: string;
    local_id: string;
    rol_id: string;
    name: string;
    email: string;
    password: string;
    activo: boolean;
};

export default function Usuarios({ usuarios, empresas, locales, roles }: Props) {
    const { flash } = usePage<Props>().props;
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const [editing, setEditing] = useState<User | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm<FormData>({
        empresa_id: '', local_id: '', rol_id: '', name: '', email: '', password: '', activo: true,
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const filteredLocales = data.empresa_id
        ? locales.filter(l => String(l.empresa_id) === data.empresa_id)
        : locales;

    const filteredRoles = data.empresa_id
        ? roles.filter(r => String(r.empresa_id) === data.empresa_id)
        : roles;

    function openCreate() { setEditing(null); reset(); setModalOpen(true); }

    function openEdit(u: User) {
        setEditing(u);
        setData({
            empresa_id: String(u.empresa_id),
            local_id: u.local_id ? String(u.local_id) : '',
            rol_id: u.rol_id ? String(u.rol_id) : '',
            name: u.name,
            email: u.email,
            password: '',
            activo: u.activo,
        });
        setModalOpen(true);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            put(route('configuracion.usuarios.update', editing.id), { onSuccess: () => { setModalOpen(false); reset(); } });
        } else {
            post(route('configuracion.usuarios.store'), { onSuccess: () => { setModalOpen(false); reset(); } });
        }
    }

    return (
        <AppLayout title="Usuarios">
            <PageHeader
                title="Usuarios"
                subtitle="Gestión de usuarios del sistema"
                actions={<Button onClick={openCreate}>+ Nuevo Usuario</Button>}
            />

            <Table>
                <Table.Head>
                    <Table.Row>
                        <Table.Th>Nombre</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Empresa</Table.Th>
                        <Table.Th>Rol</Table.Th>
                        <Table.Th>Local</Table.Th>
                        <Table.Th>Estado</Table.Th>
                        <Table.Th>Acciones</Table.Th>
                    </Table.Row>
                </Table.Head>
                <Table.Body>
                    {usuarios.length === 0 ? <Table.Empty /> : usuarios.map(u => (
                        <Table.Row key={u.id}>
                            <Table.Td className="font-medium">{u.name}</Table.Td>
                            <Table.Td className="text-xs font-mono">{u.email}</Table.Td>
                            <Table.Td>{u.empresa?.nombre_comercial ?? u.empresa?.razon_social}</Table.Td>
                            <Table.Td>{u.rol?.nombre ?? '—'}</Table.Td>
                            <Table.Td>{u.local?.nombre ?? '—'}</Table.Td>
                            <Table.Td>
                                <Badge variant={u.activo ? 'success' : 'secondary'}>
                                    {u.activo ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </Table.Td>
                            <Table.Td>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>Editar</Button>
                                    <Button variant="danger" size="sm" onClick={() => setConfirmId(u.id)}>Eliminar</Button>
                                </div>
                            </Table.Td>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? 'Editar Usuario' : 'Nuevo Usuario'}
                size="lg"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button loading={processing} onClick={submit}>{editing ? 'Guardar' : 'Crear'}</Button>
                    </>
                }
            >
                <form onSubmit={submit} className="space-y-4">
                    <Select
                        label="Empresa" required
                        value={data.empresa_id}
                        onChange={e => { setData('empresa_id', e.target.value); setData('local_id', ''); setData('rol_id', ''); }}
                        error={errors.empresa_id}
                    >
                        <option value="">Seleccione empresa</option>
                        {empresas.map(e => <option key={e.id} value={e.id}>{e.razon_social}</option>)}
                    </Select>
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Local" value={data.local_id} onChange={e => setData('local_id', e.target.value)} error={errors.local_id}>
                            <option value="">Sin local</option>
                            {filteredLocales.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                        </Select>
                        <Select label="Rol" required value={data.rol_id} onChange={e => setData('rol_id', e.target.value)} error={errors.rol_id}>
                            <option value="">Seleccione rol</option>
                            {filteredRoles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Nombre" required value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} />
                        <Input label="Email" type="email" required value={data.email} onChange={e => setData('email', e.target.value)} error={errors.email} />
                    </div>
                    {!editing && (
                        <Input label="Contraseña" type="password" required value={data.password} onChange={e => setData('password', e.target.value)} error={errors.password} />
                    )}
                    {editing && (
                        <Input label="Nueva contraseña (dejar en blanco para no cambiar)" type="password" value={data.password} onChange={e => setData('password', e.target.value)} error={errors.password} />
                    )}
                    <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--color-text)' }}>
                        <input type="checkbox" checked={data.activo} onChange={e => setData('activo', e.target.checked)} />
                        Usuario activo
                    </label>
                </form>
            </Modal>

            <Modal
                isOpen={confirmId !== null}
                onClose={() => setConfirmId(null)}
                title="Confirmar eliminación"
                size="sm"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setConfirmId(null)}>Cancelar</Button>
                        <Button variant="danger" onClick={() => { if (confirmId) { router.delete(route('configuracion.usuarios.destroy', confirmId)); setConfirmId(null); } }}>Eliminar</Button>
                    </>
                }
            >
                <p className="text-sm" style={{ color: 'var(--color-text)' }}>¿Eliminar este usuario?</p>
            </Modal>
        </AppLayout>
    );
}
