import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { utils } from '../../services/api'

export default function StatsCard({ title, value, icon: Icon, color, bgColor, description, gradient }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="hover-lift"
    >
      <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={`p-3 rounded-xl ${bgColor} shadow-sm`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        </CardContent>
        
        {/* Gradient overlay */}
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient || 'from-primary/20 to-transparent'} rounded-full -translate-y-12 translate-x-12 opacity-50`} />
        
        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient || 'from-primary to-primary/50'} opacity-80`} />
      </Card>
    </motion.div>
  )
}






