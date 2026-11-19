"use client";

import { useState } from "react";

import { AtSign, KeyRound, MessageCircle, Reply, Sparkles, UserPlus } from "lucide-react";

import { META_RULES, RuleHint } from "../meta-rules";
import { Field, Modal, inputCls } from "../modal";
import { errorText } from "./use-api";

import { Toggle } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api, type Automation, type AutomationType, type Capabilities } from "@/lib/marketing-api";
import { cn } from "@/lib/utils";

export const TYPE_META: Record<AutomationType, { label: string; icon: React.ComponentType<{ className?: string }>; text: string }> = {
  comment_to_dm: { label: "Comment-to-DM", icon: MessageCircle, text: "Someone comments a word, Sojao sends one private reply." },
  story_reply: { label: "Story reply", icon: Reply, text: "Someone replies to your story, Sojao answers." },
  story_mention: { label: "Story mention", icon: AtSign, text: "Someone mentions you in their story, Sojao says thanks." },
  dm_keyword: { label: "DM keyword", icon: KeyRound, text: "A DM contains a word, Sojao sends your saved reply." },
  welcome: { label: "Welcome", icon: Sparkles, text: "Someone messages you for the first time." },
  follow: { label: "New follower", icon: UserPlus, text: "Not available: Instagram doesn't tell apps about new followers." },
};

type Form = {
  name: string;
  scopeMode: "all" | "media";
  mediaIds: string;
  matchMode: "any" | "contains" | "exact";
  keywords: string;
  excludeWords: string;
  includeLive: boolean;
  replyMode: "button_then_link" | "link_in_first";
  text: string;
  buttonTitle: string;
  replyKeyword: string;
  linkUrl: string;
  linkTitle: string;
  linkText: string;
  storyMode: "template" | "ai";
  offerText: string;
  cooldownMinutes: string;
  businessHoursOnly: boolean;
  tag: string;
  collect: boolean;
  publicOn: boolean;
  publicMode: "approve" | "auto";
  publicTemplates: string;
  publicAi: boolean;
  consentText: string;
};

const DEFAULT_CONSENT = "By sharing your details you agree we may contact you about your request. Reply STOP anytime.";
const list = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

function fromConfig(a?: Automation): Form {
  // Configs are validated server-side; read them loosely here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = (a?.config ?? {}) as Record<string, any>;
  const reply = c.reply ?? {};
  return {
    name: a?.name ?? "",
    scopeMode: c.scope?.mode ?? "all",
    mediaIds: (c.scope?.mediaIds ?? []).join(", "),
    matchMode: c.match?.mode ?? "contains",
    keywords: (c.match?.keywords ?? []).join(", "),
    excludeWords: (c.excludeWords ?? []).join(", "),
    includeLive: !!c.includeLive,
    replyMode: reply.mode === "link_in_first" ? "link_in_first" : "button_then_link",
    text: reply.text ?? c.thankYouText ?? "",
    buttonTitle: reply.buttonTitle ?? "Send me the link",
    replyKeyword: reply.replyKeyword ?? "LINK",
    linkUrl: reply.link?.url ?? "",
    linkTitle: reply.link?.title ?? "Open link",
    linkText: reply.linkText ?? "Here you go!",
    storyMode: reply.mode === "ai" ? "ai" : "template",
    offerText: c.offerText ?? "",
    cooldownMinutes: c.cooldownMinutes !== undefined ? String(c.cooldownMinutes) : "",
    businessHoursOnly: !!c.businessHoursOnly,
    tag: c.tag ?? "",
    collect: !!c.collectFields,
    consentText: c.collectFields?.consentText ?? DEFAULT_CONSENT,
    publicOn: !!c.publicReply?.enabled,
    publicMode: c.publicReply?.mode === "auto" ? "auto" : "approve",
    publicTemplates: (c.publicReply?.templates ?? ["Check your DMs! 💌", "Just sent you a message ✨"]).join("\n"),
    publicAi: c.publicReply?.aiVariation ?? true,
  };
}

function toConfig(type: AutomationType, f: Form): Record<string, unknown> {
  const common: Record<string, unknown> = {
    ...(f.cooldownMinutes !== "" ? { cooldownMinutes: Number(f.cooldownMinutes) } : {}),
    businessHoursOnly: f.businessHoursOnly,
    ...(f.tag.trim() ? { tag: f.tag.trim() } : {}),
    ...(f.collect ? { collectFields: { consentText: f.consentText, fields: ["name", "email", "phone"] } } : {}),
  };
  const match = f.matchMode === "any" ? { mode: "any" } : { mode: f.matchMode, keywords: list(f.keywords) };
  switch (type) {
    case "comment_to_dm":
      return {
        ...common,
        scope: f.scopeMode === "all" ? { mode: "all" } : { mode: "media", mediaIds: list(f.mediaIds) },
        match,
        excludeWords: list(f.excludeWords),
        includeLive: f.includeLive,
        ...(f.publicOn
          ? {
              publicReply: {
                enabled: true,
                mode: f.publicMode,
                templates: f.publicTemplates.split("\n").map((t) => t.trim()).filter(Boolean),
                aiVariation: f.publicAi,
              },
            }
          : {}),
        reply: {
          mode: f.replyMode,
          text: f.text,
          buttonTitle: f.buttonTitle,
          replyKeyword: f.replyKeyword,
          link: { url: f.linkUrl, title: f.linkTitle },
          linkText: f.linkText,
        },
      };
    case "story_reply":
      return { ...common, reply: f.storyMode === "ai" ? { mode: "ai" } : { mode: "template", text: f.text } };
    case "story_mention":
      return { ...common, thankYouText: f.text, ...(f.offerText.trim() ? { offerText: f.offerText.trim() } : {}) };
    case "dm_keyword":
      return { ...common, match, excludeWords: list(f.excludeWords), reply: { text: f.text } };
    case "welcome":
    case "follow":
      return { ...common, reply: { text: f.text } };
  }
}

export function AutomationForm({
  initial,
  caps,
  onClose,
  onSaved,
}: {
  initial?: Automation;
  caps: Capabilities | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [type, setType] = useState<AutomationType>(initial?.type ?? "comment_to_dm");
  const [f, setF] = useState<Form>(() => fromConfig(initial));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));
  const unavailable = caps?.[type]?.available === false;

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const config = toConfig(type, f);
      const name = f.name.trim() || TYPE_META[type].label;
      if (initial) await api(`/automations/${initial.id}`, { method: "PATCH", body: { name, config } });
      else await api("/automations", { method: "POST", body: { type, name, config, status: "enabled" } });
      onSaved();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setSaving(false);
    }
  };

  const showKeywords = type === "comment_to_dm" || type === "dm_keyword";

  return (
    <Modal
      title={initial ? "Edit automation" : "New automation"}
      description={TYPE_META[type].text}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving || unavailable}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {!initial && (
          <div className="grid gap-2 sm:grid-cols-3">
            {(Object.keys(TYPE_META) as AutomationType[]).map((t) => {
              const Icon = TYPE_META[t].icon;
              const off = caps?.[t]?.available === false;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  aria-pressed={type === t}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border p-3 text-left text-sm",
                    type === t ? "border-primary bg-accent/60" : "hover:bg-accent/40",
                    off && "opacity-60",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="font-medium">{TYPE_META[t].label}</span>
                  {off && <span className="text-muted-foreground ml-auto text-xs">N/A</span>}
                </button>
              );
            })}
          </div>
        )}

        {unavailable ? (
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
            {caps?.[type]?.note ?? "This trigger is not available on Instagram."}
          </p>
        ) : (
          <>
            <Field label="Name">
              <input className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder={TYPE_META[type].label} />
            </Field>

            {type === "comment_to_dm" && (
              <Field label="Which posts">
                <select className={inputCls} value={f.scopeMode} onChange={(e) => set("scopeMode", e.target.value as Form["scopeMode"])}>
                  <option value="all">All posts and reels</option>
                  <option value="media">Specific posts or reels</option>
                </select>
              </Field>
            )}
            {type === "comment_to_dm" && f.scopeMode === "media" && (
              <Field label="Post or reel IDs" hint={<span className="text-muted-foreground text-xs">Comma separated.</span>}>
                <input className={inputCls} value={f.mediaIds} onChange={(e) => set("mediaIds", e.target.value)} />
              </Field>
            )}

            {showKeywords && (
              <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
                <Field label="Match">
                  <select className={inputCls} value={f.matchMode} onChange={(e) => set("matchMode", e.target.value as Form["matchMode"])}>
                    {type === "comment_to_dm" && <option value="any">Any comment</option>}
                    <option value="contains">Contains a word</option>
                    <option value="exact">Exactly the word</option>
                  </select>
                </Field>
                {f.matchMode !== "any" && (
                  <Field label="Keywords" hint={<span className="text-muted-foreground text-xs">Comma separated. Not case sensitive.</span>}>
                    <input className={inputCls} value={f.keywords} onChange={(e) => set("keywords", e.target.value)} placeholder="link, price" />
                  </Field>
                )}
              </div>
            )}
            {showKeywords && (
              <Field label="Ignore if it contains" hint={<span className="text-muted-foreground text-xs">Optional. Comma separated.</span>}>
                <input className={inputCls} value={f.excludeWords} onChange={(e) => set("excludeWords", e.target.value)} />
              </Field>
            )}

            {type === "story_reply" && (
              <Field label="Reply with">
                <select className={inputCls} value={f.storyMode} onChange={(e) => set("storyMode", e.target.value as Form["storyMode"])}>
                  <option value="template">My fixed message</option>
                  <option value="ai">AI reply from my brand profile</option>
                </select>
              </Field>
            )}
            {type === "story_reply" && f.storyMode === "ai" && (
              <RuleHint>Sojao answers only from your brand profile. If it isn't sure, or a reply mentions a price or offer you didn't add, the chat is flagged for a human instead.</RuleHint>
            )}

            {!(type === "story_reply" && f.storyMode === "ai") && (
              <Field label={type === "story_mention" ? "Thank-you message" : type === "comment_to_dm" ? "First message (private reply)" : "Message"}>
                <textarea rows={3} className={cn(inputCls, "h-auto py-2")} value={f.text} onChange={(e) => set("text", e.target.value)} maxLength={640} />
              </Field>
            )}

            {type === "story_mention" && (
              <>
                <Field label="Offer (optional)" hint={<span className="text-muted-foreground text-xs">Sent exactly as you write it. Sojao never makes up offers.</span>}>
                  <textarea rows={2} className={cn(inputCls, "h-auto py-2")} value={f.offerText} onChange={(e) => set("offerText", e.target.value)} />
                </Field>
                <RuleHint>Instagram only notifies us about mentions from public accounts.</RuleHint>
              </>
            )}

            {type === "comment_to_dm" && (
              <>
                <Field label="How to send the link">
                  <select className={inputCls} value={f.replyMode} onChange={(e) => set("replyMode", e.target.value as Form["replyMode"])}>
                    <option value="button_then_link">Ask first, send the link after they respond (recommended)</option>
                    <option value="link_in_first">Put the link in the first message</option>
                  </select>
                </Field>
                {f.replyMode === "button_then_link" &&
                  (caps?.comment_to_dm?.privateReplyButtons ? (
                    <Field label="Button text">
                      <input className={inputCls} maxLength={20} value={f.buttonTitle} onChange={(e) => set("buttonTitle", e.target.value)} />
                    </Field>
                  ) : (
                    <Field
                      label="Reply word"
                      hint={<span className="text-muted-foreground text-xs">We add: Reply “{f.replyKeyword || "LINK"}” and I&apos;ll send it. Their reply opens the 24-hour window.</span>}
                    >
                      <input className={inputCls} maxLength={20} value={f.replyKeyword} onChange={(e) => set("replyKeyword", e.target.value)} />
                    </Field>
                  ))}
                <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
                  <Field label="Link">
                    <input className={inputCls} type="url" value={f.linkUrl} onChange={(e) => set("linkUrl", e.target.value)} placeholder="https://" />
                  </Field>
                  <Field label="Link button">
                    <input className={inputCls} maxLength={20} value={f.linkTitle} onChange={(e) => set("linkTitle", e.target.value)} />
                  </Field>
                </div>
                {f.replyMode === "button_then_link" && (
                  <Field label="Message with the link">
                    <input className={inputCls} value={f.linkText} onChange={(e) => set("linkText", e.target.value)} />
                  </Field>
                )}
                <div className="flex items-center justify-between gap-3 text-sm">
                  Also reply to Instagram Live comments (only while live)
                  <Toggle defaultOn={f.includeLive} label="Include live comments" onChange={(v) => set("includeLive", v)} />
                </div>
                <RuleHint>{META_RULES.privateReply}</RuleHint>
                <div className="rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-3 text-sm font-medium">
                    Also reply publicly under the comment
                    <Toggle defaultOn={f.publicOn} label="Public reply" onChange={(v) => set("publicOn", v)} />
                  </div>
                  {f.publicOn && (
                    <div className="mt-4 space-y-4">
                      <Field label="Public reply templates (one per line)" hint={<span className="text-muted-foreground text-xs">Sojao rotates them and never posts the same text twice within an hour.</span>}>
                        <textarea rows={3} className={cn(inputCls, "h-auto py-2")} value={f.publicTemplates} onChange={(e) => set("publicTemplates", e.target.value)} />
                      </Field>
                      <Field label="Posting">
                        <select className={inputCls} value={f.publicMode} onChange={(e) => set("publicMode", e.target.value as Form["publicMode"])}>
                          <option value="approve">I approve each reply first (recommended)</option>
                          <option value="auto">Post automatically</option>
                        </select>
                      </Field>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        Let AI vary the wording and match the commenter&apos;s language
                        <Toggle defaultOn={f.publicAi} label="AI variation" onChange={(v) => set("publicAi", v)} />
                      </div>
                      <RuleHint>Spam, insults and complaints never get a public reply: you get an alert instead. Prices are only mentioned if they&apos;re in your brand profile.</RuleHint>
                    </div>
                  )}
                </div>
              </>
            )}

            <details className="rounded-xl border p-4">
              <summary className="cursor-pointer text-sm font-medium">More options</summary>
              <div className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Cooldown per person (minutes)">
                    <input className={inputCls} inputMode="numeric" value={f.cooldownMinutes} onChange={(e) => set("cooldownMinutes", e.target.value.replace(/\D/g, ""))} placeholder="default" />
                  </Field>
                  <Field label="Add tag">
                    <input className={inputCls} value={f.tag} onChange={(e) => set("tag", e.target.value)} placeholder="e.g. New lead" />
                  </Field>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm">
                  Only during business hours
                  <Toggle defaultOn={f.businessHoursOnly} label="Only during business hours" onChange={(v) => set("businessHoursOnly", v)} />
                </div>
                <div className="flex items-center justify-between gap-3 text-sm">
                  Then ask for name, email and phone (all skippable)
                  <Toggle defaultOn={f.collect} label="Collect lead details" onChange={(v) => set("collect", v)} />
                </div>
                {f.collect && (
                  <Field label="Consent text" hint={<span className="text-muted-foreground text-xs">Shown before the first question and saved with the lead.</span>}>
                    <textarea rows={2} className={cn(inputCls, "h-auto py-2")} value={f.consentText} onChange={(e) => set("consentText", e.target.value)} />
                  </Field>
                )}
              </div>
            </details>
          </>
        )}
        {error && (
          <p role="alert" className="text-sm text-rose-600">
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}
