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
import type { Empresa, PageProps, Rol } from '@/types';

interface Props extends PageProps {
    roles: Rol[];
    empresas: Empresa[];
}

type FormData = {
    empresa_id: string;
    nombre: string;
    descripcion: string;
    es_admin: boolean;
    activo: boolean;
};

export default function Roles({ roles, empresas }: Props) {
    const { flash } = usePage<Props>().props;
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const [editing, setEditing] = useState<Rol | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm<FormData>({
        empresa_id: '',
        nombre: '',
        descripcion: '',
        es_admin: false,
        activo: true,
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    function openCreate() { setEditing(null); reset(); setModalOpen(true); }

    function openEdit(rol: Rol) {
        setEditing(rol);
        setData({
            empresa_id: String(rol.empresa_id),
            nombre: rol.nombre,
            descripcion: rol.descripcion ?? '',
            es_admin: rol.es_admin,
            activo: rol.activo,
        });
        setModalOpen(true);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            put(route('configuracion.roles.update', editing.id), { onSuccess: () => { setModalOpen(false); reset(); } });
        } else {
            post(route('configuracion.roles.store'), { onSuccess: () => { setModalOpen(false); reset(); } });
        }
    }

    return (
        <AppLayout title="Roles">
            <PageHeader
                title="Roles"
                subtitle="Gestión de roles de acceso"
                actions={<Button onClick={openCreate}>+ Nuevo Rol</Button>}
            />

            <Table>
                <Table.Head>
                    <Table.Row>
                        <Table.Th>Empresa</Table.Th>
                        <Table.Th>Nombre</Table.Th>
                        <Table.Th>Admin Global</Table.Th>
                        <Table.Th>Estado</Table.Th>
                        <Table.Th>Acciones</Table.Th>
                    </Table.Row>
                </Table.Head>
                <Table.Body>
                    {roles.length === 0 ? <Table.Empty /> : roles.map(rol => (
                        <Table.Row key={rol.id}>
                            <Table.Td>{rol.empresa?.nombre_comercial ?? rol.empresa?.razon_social}</Table.Td>
                            <Table.Td className="font-medium">{rol.nombre}</Table.Td>
                            <Table.Td>
                                <Badge variant={rol.es_admin ? 'warning' : 'secondary'}>
                                    {rol.es_admin ? 'Sí' : 'No'}
                                </Badge>
                            </Table.Td>
                            <Table.Td>
                                <Badge variant={rol.activo ? 'success' : 'secondary'}>
                                    {rol.activo ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </Table.Td>
                            <Table.Td>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => openEdit(rol)}>Editar</Button>
                                    <Button variant="danger" size="sm" onClick={() => setConfirmId(rol.id)}>Eliminar</Button>
                                </div>
                            </Table.Td>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? 'Editar Rol' : 'Nuevo Rol'}
                size="md"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button loading={processing} onClick={submit}>{editing ? 'Guardar' : 'Crear'}</Button>
                    </>
                }
            >
                <form onSubmit={submit} className="space-y-4">
                    <Select label="Empresa" required value={data.empresa_id} onChange={e => setData('empresa_id', e.target.value)} error={errors.empresa_id}>
                        <option value="">Seleccione empresa</option>
                        {empresas.map(e => <option key={e.id} value={e.id}>{e.razon_social}</option>)}
                    </Select>
                    <Input label="Nombre" required value={data.nombre} onChange={e => setData('nombre', e.target.value)} error={errors.nombre} />
                    <Input label="Descripción" value={data.descripcion} onChange={e => setData('descripcion', e.target.value)} />
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--color-text)' }}>
                            <input type="checkbox" checked={data.es_admin} onChange={e => setData('es_admin', e.target.checked)} />
                            Admin global
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--color-text)' }}>
                            <input type="checkbox" checked={data.activo} onChange={e => setData('activo', e.target.checked)} />
                            Activo
                        </label>
                    </div>
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
                        <Button variant="danger" onClick={() => { if (confirmId) { router.delete(route('configuracion.roles.destroy', confirmId)); setConfirmId(null); } }}>Eliminar</Button>
                    </>
                }
            >
                <p className="text-sm" style={{ color: 'var(--color-text)' }}>¿Eliminar este rol?</p>
            </Modal>
        </AppLayout>
    );
}
