"use client";

import { FormEvent, useState } from "react";

const ENGINEERING_EMAIL = "isouza@livemode.com";

const initial = {
  requester: "", platform: "", channelName: "", launchDate: "", regions: "Brasil",
  businessModel: "", partnerShare: "", platformShare: "", otherModel: "",
  cdnOwner: "", inventoryOwner: "", adServer: "", vast: "",
  ssaiPayer: "", ssaiManager: "", ssaiOther: "", rights: "",
  contentOwner: "", notes: ""
};

type State = typeof initial;

export default function FastRequestForm({ signedEmail }: { signedEmail: string }) {
  const [form, setForm] = useState<State>(initial);
  const [summary, setSummary] = useState("Preencha o formulario e gere o resumo do pedido.");
  const [message, setMessage] = useState("");

  const showShare = ["Revenue Share", "Inventory Share"].includes(form.businessModel);
  const showAd = ["Content Partner", "Compartilhado"].includes(form.inventoryOwner);
  const showOtherSsai = form.ssaiManager === "Outro fornecedor";

  function setField(key: keyof State, value: string) { setForm((p) => ({ ...p, [key]: value })); }

  function validate() {
    const required = [form.requester, form.platform, form.channelName, form.launchDate, form.regions, form.businessModel, form.cdnOwner, form.inventoryOwner, form.ssaiPayer, form.ssaiManager];
    if (required.some((v) => !v.trim())) { setMessage("Preencha todos os campos obrigatorios."); return false; }
    if (showShare && form.partnerShare && form.platformShare && Number(form.partnerShare) + Number(form.platformShare) !== 100) {
      setMessage("A soma dos percentuais deve ser 100%."); return false;
    }
    return true;
  }

  function buildSummary() {
    if (!validate()) return null;
    const date = new Date(`${form.launchDate}T12:00:00`).toLocaleDateString("pt-BR");
    const lines = [
      "SOLICITACAO DE CRIACAO DE CANAL FAST", "",
      `Solicitante: ${form.requester}`, `E-mail autenticado: ${signedEmail}`, `Plataforma: ${form.platform}`,
      `Canal: ${form.channelName}`, `Data prevista de lancamento: ${date}`, `Regiao(oes): ${form.regions}`, "",
      "MODELO COMERCIAL", `Modelo: ${form.businessModel}`,
      showShare ? `Divisao: ${form.partnerShare || "a definir"}% Content Partner / ${form.platformShare || "a definir"}% Plataforma` : "",
      form.businessModel === "Outro" ? `Descricao: ${form.otherModel || "nao informada"}` : "", "",
      "CDN", `Responsavel: ${form.cdnOwner}`, "",
      "INVENTARIO PUBLICITARIO", `Responsavel: ${form.inventoryOwner}`, `Ad Server: ${form.adServer || "nao informado"}`, `VAST Tag: ${form.vast || "nao informado"}`, "",
      "SSAI", `Pagamento: ${form.ssaiPayer}`, `Gestao: ${form.ssaiManager}`, showOtherSsai ? `Fornecedor: ${form.ssaiOther || "nao informado"}` : "", "",
      "CONTEUDO E DIREITOS", `Direitos validados: ${form.rights || "nao informado"}`, `Responsavel pelo conteudo: ${form.contentOwner || "nao informado"}`, "",
      "INFORMACOES ADICIONAIS", form.notes || "Sem observacoes adicionais."
    ].filter(Boolean);
    const text = lines.join("\n"); setSummary(text); setMessage("Resumo gerado com sucesso."); return text;
  }

  function onSubmit(e: FormEvent) { e.preventDefault(); buildSummary(); }
  function send() { const text = buildSummary(); if (!text) return; const subject = `Novo pedido de Canal FAST - ${form.platform} - ${form.channelName}`; window.location.href = `mailto:${ENGINEERING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`; }
  async function copy() { await navigator.clipboard.writeText(summary); setMessage("Resumo copiado."); }
  function reset() { setForm(initial); setSummary("Preencha o formulario e gere o resumo do pedido."); setMessage(""); }

  return (
    <main className="container main">
      <div className="intro"><div><h2>Novo pedido de canal</h2><p>Centralize as definicoes comerciais, tecnicas e operacionais.</p></div><span className="pill">Acesso autenticado</span></div>
      <form onSubmit={onSubmit}>
        <Section title="1. Informacoes gerais"><Grid>
          <Field label="Solicitante *"><input value={form.requester} onChange={e=>setField("requester",e.target.value)} /></Field>
          <Field label="Plataforma *"><input value={form.platform} onChange={e=>setField("platform",e.target.value)} placeholder="Ex.: Fire TV, Pluto TV, TCL" /></Field>
          <Field label="Nome do canal *"><input value={form.channelName} onChange={e=>setField("channelName",e.target.value)} /></Field>
          <Field label="Data prevista de lancamento *"><input type="date" value={form.launchDate} onChange={e=>setField("launchDate",e.target.value)} /></Field>
          <Field label="Regiao(oes) de distribuicao *" full><input value={form.regions} onChange={e=>setField("regions",e.target.value)} /></Field>
        </Grid></Section>

        <Section title="2. Modelo comercial">
          <Radio label="Modelo de negocio *" name="businessModel" value={form.businessModel} set={(v)=>setField("businessModel",v)} options={["Revenue Share","Inventory Share","Fee / Licenciamento","Outro"]} />
          {showShare && <div className="conditional"><Grid><Field label="Content Partner (%)"><input type="number" min="0" max="100" value={form.partnerShare} onChange={e=>setField("partnerShare",e.target.value)} /></Field><Field label="Plataforma (%)"><input type="number" min="0" max="100" value={form.platformShare} onChange={e=>setField("platformShare",e.target.value)} /></Field></Grid></div>}
          {form.businessModel === "Outro" && <div className="conditional"><Field label="Descreva o modelo"><input value={form.otherModel} onChange={e=>setField("otherModel",e.target.value)} /></Field></div>}
        </Section>

        <Section title="3. CDN e distribuicao"><Radio label="Responsavel pelo CDN *" name="cdn" value={form.cdnOwner} set={(v)=>setField("cdnOwner",v)} options={["Content Partner","Plataforma","A definir"]} /></Section>

        <Section title="4. Inventario publicitario">
          <Radio label="Responsavel pela gestao/comercializacao *" name="inventory" value={form.inventoryOwner} set={(v)=>setField("inventoryOwner",v)} options={["Content Partner","Plataforma","Compartilhado"]} />
          {showAd && <div className="conditional"><Grid><Field label="Ad Server"><input value={form.adServer} onChange={e=>setField("adServer",e.target.value)} /></Field><Field label="Integracao VAST Tag"><select value={form.vast} onChange={e=>setField("vast",e.target.value)}><option value="">Selecione</option><option>Sim</option><option>Nao</option><option>A definir</option></select></Field></Grid></div>}
        </Section>

        <Section title="5. SSAI">
          <Radio label="Responsavel pelo pagamento do SSAI *" name="ssaiPayer" value={form.ssaiPayer} set={(v)=>setField("ssaiPayer",v)} options={["Content Partner","Plataforma","A definir"]} />
          <div className="gap" />
          <Radio label="Responsavel pela gestao do SSAI *" name="ssaiManager" value={form.ssaiManager} set={(v)=>setField("ssaiManager",v)} options={["Amagi","Ad Server","Outro fornecedor"]} />
          {showOtherSsai && <div className="conditional"><Field label="Fornecedor"><input value={form.ssaiOther} onChange={e=>setField("ssaiOther",e.target.value)} /></Field></div>}
        </Section>

        <Section title="6. Conteudo, direitos e observacoes"><Grid>
          <Field label="Direitos de distribuicao validados?"><select value={form.rights} onChange={e=>setField("rights",e.target.value)}><option value="">Selecione</option><option>Sim</option><option>Em validacao</option><option>Nao</option></select></Field>
          <Field label="Responsavel pelo conteudo"><input value={form.contentOwner} onChange={e=>setField("contentOwner",e.target.value)} /></Field>
          <Field label="Informacoes adicionais" full><textarea value={form.notes} onChange={e=>setField("notes",e.target.value)} /></Field>
        </Grid></Section>

        <Section title="7. Finalizar pedido"><div className="actions"><button className="btn primary" type="submit">Gerar resumo</button><button className="btn primary" type="button" onClick={send}>Enviar para Engenharia</button><button className="btn secondary" type="button" onClick={copy}>Copiar resumo</button><button className="btn secondary" type="button" onClick={reset}>Limpar</button></div>{message && <div className="notice">{message}</div>}</Section>
        <Section title="Resumo para envio"><pre className="summary">{summary}</pre></Section>
      </form>
    </main>
  );
}

function Section({title,children}:{title:string;children:React.ReactNode}){return <section className="card"><h3>{title}</h3>{children}</section>}
function Grid({children}:{children:React.ReactNode}){return <div className="grid">{children}</div>}
function Field({label,children,full=false}:{label:string;children:React.ReactNode;full?:boolean}){return <label className={`field ${full?"full":""}`}><span>{label}</span>{children}</label>}
function Radio({label,name,value,set,options}:{label:string;name:string;value:string;set:(v:string)=>void;options:string[]}){return <div><div className="group-label">{label}</div><div className="radio-group">{options.map(o=><label className={`radio ${value===o?"selected":""}`} key={o}><input type="radio" name={name} checked={value===o} onChange={()=>set(o)} />{o}</label>)}</div></div>}
