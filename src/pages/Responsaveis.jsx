import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, Search, Edit, Trash2, Phone, Mail, User } from 'lucide-react'
import { useResponsaveis, useCreateResponsavel, useUpdateResponsavel, useDeleteResponsavel } from '../hooks/useApi'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import ResponsavelModal from '../components/modals/ResponsavelModal'

export default function Responsaveis() {
  const { data: responsaveis = [], isLoading } = useResponsaveis()
  const createResponsavel = useCreateResponsavel()
  const updateResponsavel = useUpdateResponsavel()
  const deleteResponsavel = useDeleteResponsavel()
  
  const [modalOpen, setModalOpen] = useState(false)
  const [editingResponsavel, setEditingResponsavel] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const responsaveisFiltrados = responsaveis.filter(responsavel =>
    responsavel.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    responsavel.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    responsavel.cargo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (responsavel) => {
    setEditingResponsavel(responsavel)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este responsável?')) {
      try {
        await deleteResponsavel.mutateAsync(id)
      } catch (error) {
        console.error('Erro ao excluir responsável:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingResponsavel(null)
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
            <Users className="h-8 w-8" />
            Responsáveis
          </h1>
          <p className="text-muted-foreground">
            Gerencie os responsáveis pelas obrigações
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Responsável
        </Button>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar responsáveis por nome, email ou cargo..."
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

      {/* Lista de Responsáveis */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {responsaveisFiltrados.map((responsavel, index) => (
          <motion.div
            key={responsavel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{responsavel.nome}</CardTitle>
                    <CardDescription>
                      {responsavel.cargo || 'Cargo não informado'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(responsavel)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(responsavel.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {responsavel.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{responsavel.email}</span>
                    </div>
                  )}
                  
                  {responsavel.telefone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{responsavel.telefone}</span>
                    </div>
                  )}
                  
                  {responsavel.departamento && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{responsavel.departamento}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {responsaveisFiltrados.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum responsável encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Tente ajustar os termos de busca' : 'Comece criando seu primeiro responsável'}
            </p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Responsável
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal Responsável */}
      <ResponsavelModal 
        open={modalOpen} 
        onOpenChange={handleCloseModal}
        responsavel={editingResponsavel}
      />
    </div>
  )
}



