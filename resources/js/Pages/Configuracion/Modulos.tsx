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
import type { Modulo, PageProps } from '@/types';

interface Props extends PageProps {
    modulos: Modulo[];
}

type FormData = {
    padre_id: string;
    nombre: string;
    slug: string;
    icono: string;
    ruta: string;
    orden: string;
    activo: boolean;
};

function toSlug(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s.]/g, '')
        .replace(/\s+/g, '.');
}

export default function Modulos({ modulos }: Props) {
    const { flash } = usePage<Props>().props;
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const [editing, setEditing] = useState<Modulo | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm<FormData>({
        padre_id: '', nombre: '', slug: '', icono: '', ruta: '', orden: '0', activo: true,
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    function openCreate() { setEditing(null); reset(); setModalOpen(true); }

    function openEdit(mod: Modulo) {
        setEditing(mod);
        setData({
            padre_id: mod.padre_id ? String(mod.padre_id) : '',
            nombre: mod.nombre,
            slug: mod.slug,
            icono: mod.icono ?? '',
            ruta: mod.ruta ?? '',
            orden: String(mod.orden),
            activo: mod.activo,
        });
        setModalOpen(true);
    }

    function handleNombreChange(nombre: string) {
        setData(prev => ({ ...prev, nombre, slug: toSlug(nombre) }));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            put(route('configuracion.modulos.update', editing.id), { onSuccess: () => { setModalOpen(false); reset(); } });
        } else {
            post(route('configuracion.modulos.store'), { onSuccess: () => { setModalOpen(false); reset(); } });
        }
    }

    const raices = modulos.filter(m => !m.padre_id);

    return (
        <AppLayout title="Módulos">
            <PageHeader
                title="Módulos"
                subtitle="Estructura de módulos del sistema"
                actions={<Button onClick={openCreate}>+ Nuevo Módulo</Button>}
            />

            <Table>
                <Table.Head>
                    <Table.Row>
                        <Table.Th>Orden</Table.Th>
                        <Table.Th>Nombre</Table.Th>
                        <Table.Th>Slug</Table.Th>
                        <Table.Th>Padre</Table.Th>
                        <Table.Th>Ruta</Table.Th>
                        <Table.Th>Estado</Table.Th>
                        <Table.Th>Acciones</Table.Th>
                    </Table.Row>
                </Table.Head>
                <Table.Body>
                    {modulos.length === 0 ? <Table.Empty /> : modulos.map(mod => (
                        <Table.Row key={mod.id}>
                            <Table.Td className="text-center w-12">{mod.orden}</Table.Td>
                            <Table.Td className="font-medium">{mod.nombre}</Table.Td>
                            <Table.Td className="font-mono text-xs">{mod.slug}</Table.Td>
                            <Table.Td>{mod.padre?.nombre ?? '—'}</Table.Td>
                            <Table.Td className="text-xs">{mod.ruta ?? '—'}</Table.Td>
                            <Table.Td>
                                <Badge variant={mod.activo ? 'success' : 'secondary'}>
                                    {mod.activo ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </Table.Td>
                            <Table.Td>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => openEdit(mod)}>Editar</Button>
                                    <Button variant="danger" size="sm" onClick={() => setConfirmId(mod.id)}>Eliminar</Button>
                                </div>
                            </Table.Td>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? 'Editar Módulo' : 'Nuevo Módulo'}
                size="md"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button loading={processing} onClick={submit}>{editing ? 'Guardar' : 'Crear'}</Button>
                    </>
                }
            >
                <form onSubmit={submit} className="space-y-4">
                    <Select label="Módulo padre" value={data.padre_id} onChange={e => setData('padre_id', e.target.value)}>
                        <option value="">Sin padre (módulo raíz)</option>
                        {raices.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                    </Select>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Nombre" required value={data.nombre}
                            onChange={e => handleNombreChange(e.target.value)}
                            error={errors.nombre}
                        />
                        <Input
                            label="Slug" required value={data.slug}
                            onChange={e => setData('slug', e.target.value)}
                            error={errors.slug}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Ícono (lucide)" value={data.icono} onChange={e => setData('icono', e.target.value)} hint="Ej: LayoutDashboard" />
                        <Input label="Ruta" value={data.ruta} onChange={e => setData('ruta', e.target.value)} hint="Ej: /configuracion/empresas" />
                    </div>
                    <Input label="Orden" type="number" value={data.orden} onChange={e => setData('orden', e.target.value)} error={errors.orden} />
                    <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--color-text)' }}>
                        <input type="checkbox" checked={data.activo} onChange={e => setData('activo', e.target.checked)} />
                        Activo
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
                        <Button variant="danger" onClick={() => { if (confirmId) { router.delete(route('configuracion.modulos.destroy', confirmId)); setConfirmId(null); } }}>Eliminar</Button>
                    </>
                }
            >
                <p className="text-sm" style={{ color: 'var(--color-text)' }}>¿Eliminar este módulo?</p>
            </Modal>
        </AppLayout>
    );
}
