import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Trash2, RefreshCw, Eye, X } from 'lucide-react'
import { api } from '@/api'
import { toast } from '@/hooks/use-toast'

interface LogEntry {
  id: string
  timestamp: number
  provider: string
  model: string
  status: 'success' | 'error'
  duration?: number
  prompt?: string
  response?: string
  error?: string
}

export function RequestLogList() {
  const { t } = useTranslation()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const data = await api.getLogs(100)
      setLogs(data || [])
    } catch {
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const handleClear = async () => {
    try {
      await api.clearLogs()
      setLogs([])
      toast({ title: t('logs.cleared') })
    } catch {
      toast({ title: t('logs.clearFailed'), variant: 'destructive' })
    }
  }

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleString('zh-CN')
  }

  const formatDuration = (ms?: number) => {
    if (!ms) return '-'
    return `${(ms / 1000).toFixed(1)}s`
  }

  const truncate = (text?: string, max = 60) => {
    if (!text) return ''
    return text.length > max ? text.slice(0, max) + '...' : text
  }

  return (
    <>
      {/* 日志表格 */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-semibold t-heading">{t('logs.requestList')}</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              disabled={loading}
              className="gap-1"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              {t('common.refresh')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={logs.length === 0}
              className="gap-1 text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t('logs.clear')}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center t-sub">{t('common.loading')}</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="t-sub text-sm">{t('logs.noData')}</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5">
                  <TableHead className="w-[160px] text-xs uppercase tracking-wider t-hint">
                    {t('logs.time')}
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider t-hint">
                    {t('logs.provider')}
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider t-hint">
                    {t('logs.model')}
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider t-hint">
                    {t('logs.status')}
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider t-hint">
                    {t('logs.duration')}
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider t-hint">
                    {t('logs.prompt')}
                  </TableHead>
                  <TableHead className="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow
                    key={log.id}
                    className="border-white/5 cursor-pointer hover:bg-white/5"
                    onClick={() => {
                      setSelectedLog(log)
                      setShowDetail(true)
                    }}
                  >
                    <TableCell className="font-mono text-xs t-sub">
                      {formatTime(log.timestamp)}
                    </TableCell>
                    <TableCell className="text-sm">{log.provider}</TableCell>
                    <TableCell className="text-sm t-sub">{log.model}</TableCell>
                    <TableCell>
                      <Badge
                        variant={log.status === 'success' ? 'default' : 'destructive'}
                        className={
                          log.status === 'success'
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }
                      >
                        {log.status === 'success' ? t('common.success') : t('common.error')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm t-sub font-mono">
                      {formatDuration(log.duration)}
                    </TableCell>
                    <TableCell className="text-sm t-sub max-w-[300px] truncate">
                      {truncate(log.prompt)}
                    </TableCell>
                    <TableCell>
                      <Eye className="h-4 w-4 text-white/30 hover:text-white/60 transition-colors" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* 详情弹窗 */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="t-heading">{t('logs.detail')}</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetail(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="t-hint text-xs mb-1">{t('logs.time')}</div>
                  <div className="t-sub">{formatTime(selectedLog.timestamp)}</div>
                </div>
                <div>
                  <div className="t-hint text-xs mb-1">{t('logs.provider')}</div>
                  <div>{selectedLog.provider}</div>
                </div>
                <div>
                  <div className="t-hint text-xs mb-1">{t('logs.model')}</div>
                  <div className="t-sub">{selectedLog.model}</div>
                </div>
                <div>
                  <div className="t-hint text-xs mb-1">{t('logs.status')}</div>
                  <Badge
                    variant={selectedLog.status === 'success' ? 'default' : 'destructive'}
                    className={
                      selectedLog.status === 'success'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }
                  >
                    {selectedLog.status === 'success' ? t('common.success') : t('common.error')}
                  </Badge>
                </div>
                {selectedLog.duration && (
                  <div className="col-span-2">
                    <div className="t-hint text-xs mb-1">{t('logs.duration')}</div>
                    <div className="font-mono">{formatDuration(selectedLog.duration)}</div>
                  </div>
                )}
              </div>
              {selectedLog.prompt && (
                <div>
                  <div className="t-hint text-xs mb-2">{t('logs.prompt')}</div>
                  <div className="glass-card p-3 rounded-lg text-sm t-sub whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                    {selectedLog.prompt}
                  </div>
                </div>
              )}
              {selectedLog.response && (
                <div>
                  <div className="t-hint text-xs mb-2">{t('logs.response')}</div>
                  <div className="glass-card p-3 rounded-lg text-sm t-sub whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                    {selectedLog.response}
                  </div>
                </div>
              )}
              {selectedLog.error && (
                <div>
                  <div className="t-hint text-xs mb-2 text-red-400">{t('logs.error')}</div>
                  <div className="glass-card p-3 rounded-lg text-sm text-red-300 whitespace-pre-wrap">
                    {selectedLog.error}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
