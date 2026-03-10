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
import type { Empresa, Local, PageProps } from '@/types';

interface Props extends PageProps {
    locales: Local[];
    empresas: Empresa[];
}

type FormData = {
    empresa_id: string;
    nombre: string;
    direccion: string;
    telefono: string;
    es_principal: boolean;
    activo: boolean;
};

export default function Locales({ locales, empresas }: Props) {
    const { flash } = usePage<Props>().props;
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const [editing, setEditing] = useState<Local | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm<FormData>({
        empresa_id: '',
        nombre: '',
        direccion: '',
        telefono: '',
        es_principal: false,
        activo: true,
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    function openCreate() {
        setEditing(null);
        reset();
        setModalOpen(true);
    }

    function openEdit(loc: Local) {
        setEditing(loc);
        setData({
            empresa_id: String(loc.empresa_id),
            nombre: loc.nombre,
            direccion: loc.direccion ?? '',
            telefono: loc.telefono ?? '',
            es_principal: loc.es_principal,
            activo: loc.activo,
        });
        setModalOpen(true);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            put(route('configuracion.locales.update', editing.id), {
                onSuccess: () => { setModalOpen(false); reset(); },
            });
        } else {
            post(route('configuracion.locales.store'), {
                onSuccess: () => { setModalOpen(false); reset(); },
            });
        }
    }

    return (
        <AppLayout title="Locales">
            <PageHeader
                title="Locales"
                subtitle="Sucursales y locales por empresa"
                actions={<Button onClick={openCreate}>+ Nuevo Local</Button>}
            />

            <Table>
                <Table.Head>
                    <Table.Row>
                        <Table.Th>Empresa</Table.Th>
                        <Table.Th>Nombre</Table.Th>
                        <Table.Th>Dirección</Table.Th>
                        <Table.Th>Principal</Table.Th>
                        <Table.Th>Estado</Table.Th>
                        <Table.Th>Acciones</Table.Th>
                    </Table.Row>
                </Table.Head>
                <Table.Body>
                    {locales.length === 0 ? <Table.Empty /> : locales.map(loc => (
                        <Table.Row key={loc.id}>
                            <Table.Td>{loc.empresa?.nombre_comercial ?? loc.empresa?.razon_social}</Table.Td>
                            <Table.Td className="font-medium">{loc.nombre}</Table.Td>
                            <Table.Td>{loc.direccion ?? '—'}</Table.Td>
                            <Table.Td>
                                <Badge variant={loc.es_principal ? 'primary' : 'secondary'}>
                                    {loc.es_principal ? 'Sí' : 'No'}
                                </Badge>
                            </Table.Td>
                            <Table.Td>
                                <Badge variant={loc.activo ? 'success' : 'secondary'}>
                                    {loc.activo ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </Table.Td>
                            <Table.Td>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => openEdit(loc)}>Editar</Button>
                                    <Button variant="danger" size="sm" onClick={() => setConfirmId(loc.id)}>Eliminar</Button>
                                </div>
                            </Table.Td>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? 'Editar Local' : 'Nuevo Local'}
                size="md"
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
                        onChange={e => setData('empresa_id', e.target.value)}
                        error={errors.empresa_id}
                    >
                        <option value="">Seleccione empresa</option>
                        {empresas.map(e => <option key={e.id} value={e.id}>{e.razon_social}</option>)}
                    </Select>
                    <Input label="Nombre" required value={data.nombre} onChange={e => setData('nombre', e.target.value)} error={errors.nombre} />
                    <Input label="Dirección" value={data.direccion} onChange={e => setData('direccion', e.target.value)} />
                    <Input label="Teléfono" value={data.telefono} onChange={e => setData('telefono', e.target.value)} />
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--color-text)' }}>
                            <input type="checkbox" checked={data.es_principal} onChange={e => setData('es_principal', e.target.checked)} />
                            Local principal
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
                        <Button variant="danger" onClick={() => { if (confirmId) { router.delete(route('configuracion.locales.destroy', confirmId)); setConfirmId(null); } }}>Eliminar</Button>
                    </>
                }
            >
                <p className="text-sm" style={{ color: 'var(--color-text)' }}>¿Eliminar este local? Esta acción no se puede deshacer.</p>
            </Modal>
        </AppLayout>
    );
}
