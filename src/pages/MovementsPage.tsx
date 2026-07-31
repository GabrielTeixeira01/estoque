import { ArrowDownToLine, ArrowUpFromLine, CheckCircle2, PackageCheck, Shirt, Warehouse } from 'lucide-react'
import { type FormEvent, useMemo, useState } from 'react'
import { UNIFORM_SIZES, UNIFORM_TYPES } from '../data/constants'
import type { EntryFormData, ExitFormData, FormErrors, StockItem, UniformMovement } from '../types'
import { todayAsInputValue } from '../utils/formatters'

interface MovementsPageProps {
  stock: StockItem[]
  getAvailableQuantity: (uniformType: string, size: string) => number
  onRegisterEntry: (form: EntryFormData) => UniformMovement
  onRegisterExit: (form: ExitFormData) => UniformMovement | null
}

const emptyEntry = (): EntryFormData => ({
  uniformType: '', size: '', quantity: '', supplier: '', movementDate: todayAsInputValue(), notes: '',
})

const emptyExit = (): ExitFormData => ({
  uniformType: '', size: '', quantity: '', employee: '', registration: '', department: '', movementDate: todayAsInputValue(), notes: '',
})

export function MovementsPage({ stock, getAvailableQuantity, onRegisterEntry, onRegisterExit }: MovementsPageProps) {
  const [mode, setMode] = useState<'entry' | 'exit'>('entry')
  const [entry, setEntry] = useState<EntryFormData>(emptyEntry)
  const [exit, setExit] = useState<ExitFormData>(emptyExit)
  const [entryErrors, setEntryErrors] = useState<FormErrors<EntryFormData>>({})
  const [exitErrors, setExitErrors] = useState<FormErrors<ExitFormData>>({})
  const [success, setSuccess] = useState('')

  const availableTypes = useMemo(() => (
    [...new Set(stock.filter((item) => item.quantity > 0).map((item) => item.uniformType))]
      .sort((a, b) => a.localeCompare(b, 'pt-BR'))
  ), [stock])
  const availableSizes = useMemo(() => (
    stock
      .filter((item) => item.quantity > 0 && item.uniformType === exit.uniformType)
      .map((item) => item.size)
      .sort((a, b) => a.localeCompare(b, 'pt-BR'))
  ), [exit.uniformType, stock])
  const availableQuantity = getAvailableQuantity(exit.uniformType, exit.size)

  const changeMode = (nextMode: 'entry' | 'exit') => {
    setMode(nextMode)
    setSuccess('')
    setEntryErrors({})
    setExitErrors({})
  }

  const submitEntry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors: FormErrors<EntryFormData> = {}
    if (!entry.uniformType) errors.uniformType = 'Selecione o tipo de uniforme.'
    if (!entry.size) errors.size = 'Selecione o tamanho.'
    if (!entry.quantity || Number(entry.quantity) <= 0) errors.quantity = 'Informe uma quantidade válida.'
    if (!entry.supplier.trim()) errors.supplier = 'Informe o fornecedor da remessa.'
    if (!entry.movementDate) errors.movementDate = 'Informe a data de recebimento.'
    setEntryErrors(errors)
    if (Object.keys(errors).length > 0) return

    onRegisterEntry(entry)
    setSuccess(`${entry.quantity} peças de ${entry.uniformType}, tamanho ${entry.size}, adicionadas ao estoque.`)
    setEntry(emptyEntry())
  }

  const submitExit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors: FormErrors<ExitFormData> = {}
    const quantity = Number(exit.quantity)
    if (!exit.uniformType) errors.uniformType = 'Selecione o tipo de uniforme.'
    if (!exit.size) errors.size = 'Selecione o tamanho.'
    if (!exit.quantity || quantity <= 0) errors.quantity = 'Informe uma quantidade válida.'
    else if (quantity > availableQuantity) errors.quantity = `Saldo insuficiente. Disponível: ${availableQuantity}.`
    if (!exit.employee.trim()) errors.employee = 'Informe o funcionário que receberá o uniforme.'
    if (!exit.movementDate) errors.movementDate = 'Informe a data de entrega.'
    setExitErrors(errors)
    if (Object.keys(errors).length > 0) return

    const movement = onRegisterExit(exit)
    if (!movement) {
      setExitErrors({ quantity: 'O saldo mudou. Revise a quantidade disponível.' })
      return
    }
    setSuccess(`${exit.quantity} peças entregues para ${exit.employee}.`)
    setExit(emptyExit())
  }

  return (
    <div className="page">
      <div className="page-header movement-page-header">
        <div>
          <span className="eyebrow">Movimentação de estoque</span>
          <h1>{mode === 'entry' ? 'Cadastrar nova remessa' : 'Registrar entrega de uniforme'}</h1>
          <p>{mode === 'entry' ? 'Inclua no estoque os produtos que acabaram de chegar.' : 'Dê baixa no estoque ao entregar peças para um funcionário.'}</p>
        </div>
        <div className="mode-switch" role="tablist" aria-label="Tipo de movimentação">
          <button role="tab" aria-selected={mode === 'entry'} className={mode === 'entry' ? 'is-active' : ''} onClick={() => changeMode('entry')}><ArrowDownToLine size={17} /> Entrada</button>
          <button role="tab" aria-selected={mode === 'exit'} className={mode === 'exit' ? 'is-active' : ''} onClick={() => changeMode('exit')}><ArrowUpFromLine size={17} /> Saída</button>
        </div>
      </div>

      {success && <div className="success-banner" role="status"><CheckCircle2 size={18} /><span><strong>Movimentação registrada</strong>{success}</span></div>}

      <div className="movement-layout">
        <section className="operation-panel">
          <div className={`operation-panel__header operation-panel__header--${mode}`}>
            <span>{mode === 'entry' ? <PackageCheck size={21} /> : <Shirt size={21} />}</span>
            <div><h2>{mode === 'entry' ? 'Dados da remessa' : 'Dados da entrega'}</h2><p>Campos marcados com * são obrigatórios.</p></div>
          </div>

          {mode === 'entry' ? (
            <form className="operation-form" onSubmit={submitEntry} noValidate>
              <div className="form-grid">
                <label className="field"><span>Tipo de uniforme *</span><select value={entry.uniformType} onChange={(event) => setEntry({ ...entry, uniformType: event.target.value })} aria-invalid={Boolean(entryErrors.uniformType)}><option value="">Selecione o produto</option>{UNIFORM_TYPES.map((item) => <option key={item}>{item}</option>)}</select>{entryErrors.uniformType && <small className="field-error">{entryErrors.uniformType}</small>}</label>
                <label className="field"><span>Tamanho *</span><select value={entry.size} onChange={(event) => setEntry({ ...entry, size: event.target.value })} aria-invalid={Boolean(entryErrors.size)}><option value="">Selecione o tamanho</option>{UNIFORM_SIZES.map((item) => <option key={item}>{item}</option>)}</select>{entryErrors.size && <small className="field-error">{entryErrors.size}</small>}</label>
                <label className="field"><span>Quantidade recebida *</span><input type="number" min="1" step="1" value={entry.quantity} onChange={(event) => setEntry({ ...entry, quantity: event.target.value })} placeholder="Ex.: 50" aria-invalid={Boolean(entryErrors.quantity)} />{entryErrors.quantity && <small className="field-error">{entryErrors.quantity}</small>}</label>
                <label className="field"><span>Fornecedor *</span><input value={entry.supplier} onChange={(event) => setEntry({ ...entry, supplier: event.target.value })} placeholder="Nome do fornecedor" aria-invalid={Boolean(entryErrors.supplier)} />{entryErrors.supplier && <small className="field-error">{entryErrors.supplier}</small>}</label>
                <label className="field"><span>Data de recebimento *</span><input type="date" value={entry.movementDate} onChange={(event) => setEntry({ ...entry, movementDate: event.target.value })} aria-invalid={Boolean(entryErrors.movementDate)} />{entryErrors.movementDate && <small className="field-error">{entryErrors.movementDate}</small>}</label>
                <label className="field field--wide"><span>Observações</span><textarea value={entry.notes} onChange={(event) => setEntry({ ...entry, notes: event.target.value })} placeholder="Número da nota, lote ou informação adicional" rows={3} /></label>
              </div>
              <div className="form-footer"><p>A entrada será somada ao saldo do produto e tamanho selecionados.</p><button className="button button--primary" type="submit"><ArrowDownToLine size={17} /> Confirmar entrada</button></div>
            </form>
          ) : (
            <form className="operation-form" onSubmit={submitExit} noValidate>
              <div className="form-grid">
                <label className="field"><span>Tipo de uniforme *</span><select value={exit.uniformType} onChange={(event) => setExit({ ...exit, uniformType: event.target.value, size: '' })} aria-invalid={Boolean(exitErrors.uniformType)}><option value="">Selecione um item disponível</option>{availableTypes.map((item) => <option key={item}>{item}</option>)}</select>{exitErrors.uniformType && <small className="field-error">{exitErrors.uniformType}</small>}</label>
                <label className="field"><span>Tamanho *</span><select value={exit.size} disabled={!exit.uniformType} onChange={(event) => setExit({ ...exit, size: event.target.value })} aria-invalid={Boolean(exitErrors.size)}><option value="">Selecione o tamanho</option>{availableSizes.map((item) => <option key={item}>{item}</option>)}</select>{exitErrors.size && <small className="field-error">{exitErrors.size}</small>}</label>
                <label className="field"><span>Quantidade entregue *</span><input type="number" min="1" max={availableQuantity || undefined} step="1" value={exit.quantity} onChange={(event) => setExit({ ...exit, quantity: event.target.value })} placeholder="Ex.: 2" aria-invalid={Boolean(exitErrors.quantity)} />{exitErrors.quantity && <small className="field-error">{exitErrors.quantity}</small>}</label>
                <label className="field"><span>Data da entrega *</span><input type="date" value={exit.movementDate} onChange={(event) => setExit({ ...exit, movementDate: event.target.value })} aria-invalid={Boolean(exitErrors.movementDate)} />{exitErrors.movementDate && <small className="field-error">{exitErrors.movementDate}</small>}</label>
                <label className="field field--wide"><span>Funcionário *</span><input value={exit.employee} onChange={(event) => setExit({ ...exit, employee: event.target.value })} placeholder="Nome completo" aria-invalid={Boolean(exitErrors.employee)} />{exitErrors.employee && <small className="field-error">{exitErrors.employee}</small>}</label>
                <label className="field"><span>Matrícula</span><input value={exit.registration} onChange={(event) => setExit({ ...exit, registration: event.target.value })} placeholder="Ex.: 00428" /></label>
                <label className="field"><span>Setor</span><input value={exit.department} onChange={(event) => setExit({ ...exit, department: event.target.value })} placeholder="Ex.: Produção" /></label>
                <label className="field field--wide"><span>Observações</span><textarea value={exit.notes} onChange={(event) => setExit({ ...exit, notes: event.target.value })} placeholder="Motivo da entrega ou informação adicional" rows={3} /></label>
              </div>
              <div className="form-footer"><p>A saída será vinculada ao funcionário e abatida do estoque.</p><button className="button button--exit" type="submit" disabled={stock.every((item) => item.quantity <= 0)}><ArrowUpFromLine size={17} /> Confirmar saída</button></div>
            </form>
          )}
        </section>

        <aside className="balance-panel">
          <span className="balance-panel__icon"><Warehouse size={22} /></span>
          <span className="eyebrow">Saldo disponível</span>
          {mode === 'entry' ? (
            <><h2>{entry.uniformType || 'Selecione um produto'}</h2><p>{entry.size ? `Tamanho ${entry.size}` : 'O saldo atual aparecerá aqui.'}</p><strong>{entry.uniformType && entry.size ? getAvailableQuantity(entry.uniformType, entry.size) : '-'}<small> peças em estoque</small></strong></>
          ) : (
            <><h2>{exit.uniformType || 'Selecione um produto'}</h2><p>{exit.size ? `Tamanho ${exit.size}` : 'Escolha um tamanho com saldo.'}</p><strong className={availableQuantity <= 5 && exit.size ? 'is-low' : ''}>{exit.uniformType && exit.size ? availableQuantity : '-'}<small> peças disponíveis</small></strong></>
          )}
          <div className="balance-panel__note">{mode === 'entry' ? 'Após confirmar, a nova quantidade será somada imediatamente.' : availableTypes.length === 0 ? 'Não há peças disponíveis. Registre uma entrada antes da saída.' : 'O sistema não permite entregar mais peças do que o saldo atual.'}</div>
        </aside>
      </div>
    </div>
  )
}
