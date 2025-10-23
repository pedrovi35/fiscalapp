import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Plus, Search, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react'
import { useClientes, useCreateCliente, useUpdateCliente, useDeleteCliente } from '../hooks/useApi'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Input, Label, Textarea } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import ClienteModal from '../components/modals/ClienteModal'

export default function Clientes() {
  const { data: clientes = [], isLoading } = useClientes()
  const createCliente = useCreateCliente()
  const updateCliente = useUpdateCliente()
  const deleteCliente = useDeleteCliente()
  
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cnpj?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (cliente) => {
    setEditingCliente(cliente)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteCliente.mutateAsync(id)
      } catch (error) {
        console.error('Erro ao excluir cliente:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingCliente(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Clientes
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus clientes
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar clientes por nome, CNPJ ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clientesFiltrados.map((cliente, index) => (
          <motion.div
            key={cliente.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{cliente.nome}</CardTitle>
                    <CardDescription>
                      {cliente.cnpj || 'CNPJ não informado'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(cliente)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cliente.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cliente.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{cliente.email}</span>
                    </div>
                  )}
                  
                  {cliente.telefone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{cliente.telefone}</span>
                    </div>
                  )}
                  
                  {cliente.endereco && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{cliente.endereco}</span>
                    </div>
                  )}
                  
                  {cliente.observacoes && (
                    <div className="text-sm text-muted-foreground">
                      <p className="line-clamp-2">{cliente.observacoes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {clientesFiltrados.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Tente ajustar os termos de busca' : 'Comece criando seu primeiro cliente'}
            </p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal Cliente */}
      <ClienteModal 
        open={modalOpen} 
        onOpenChange={handleCloseModal}
        cliente={editingCliente}
      />
    </div>
  )
}



