"use client";

import { useState } from "react";

import { Check, Moon } from "lucide-react";

import { Avatar, PageHeader, Panel, Toggle } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const inputCls =
  "bg-background focus-visible:ring-ring/50 h-10 w-full rounded-xl border px-3 text-sm outline-none focus-visible:ring-[3px]";

export default function AccountPage() {
  const [saved, setSaved] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState("");

  const save = (key: string) => (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <>
      <PageHeader title="Account" description="Your profile, sign-in and personal preferences." />

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Profile">
          <form onSubmit={save("profile")} className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name="Your Brand" className="size-14 text-base" />
              <Button type="button" variant="outline" size="sm">
                Change photo
              </Button>
            </div>
            <Field label="Your name">
              <input defaultValue={brand.owner} className={inputCls} />
            </Field>
            <Field label="Email">
              <input type="email" defaultValue="you@yourbrand.com" className={inputCls} />
            </Field>
            <Field label="Time zone">
              <select defaultValue="America/New_York" className={inputCls}>
                <option value="America/New_York">Eastern Time (US)</option>
                <option value="America/Chicago">Central Time (US)</option>
                <option value="America/Los_Angeles">Pacific Time (US)</option>
                <option value="Europe/London">London</option>
                <option value="America/Toronto">Toronto</option>
                <option value="Australia/Sydney">Sydney</option>
              </select>
            </Field>
            <SaveButton done={saved === "profile"} />
          </form>
        </Panel>

        <div className="space-y-6">
          <Panel
            title={
              <span className="flex items-center gap-2">
                <Moon className="size-4" /> Your night shift
              </span>
            }
            description="Hours you're usually away. Sojao sends your morning summary when it ends."
          >
            <form onSubmit={save("night")} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="From">
                  <input type="time" defaultValue="22:00" className={inputCls} />
                </Field>
                <Field label="To">
                  <input type="time" defaultValue="08:00" className={inputCls} />
                </Field>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Only send “needs you” alerts outside these hours</span>
                <Toggle defaultOn label="Quiet alerts at night" />
              </div>
              <SaveButton done={saved === "night"} />
            </form>
          </Panel>

          <Panel title="Password">
            <form onSubmit={save("password")} className="space-y-4">
              <Field label="Current password">
                <input type="password" autoComplete="current-password" className={inputCls} />
              </Field>
              <Field label="New password">
                <input type="password" autoComplete="new-password" className={inputCls} />
              </Field>
              <SaveButton done={saved === "password"} label="Update password" />
            </form>
          </Panel>
        </div>
      </div>

      <Panel className="border-destructive/40 mt-6" title="Delete account" description="This removes your brand, chats and settings from Sojao. It can't be undone.">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.value)}
            placeholder="Type DELETE to confirm"
            className={cn(inputCls, "sm:max-w-xs")}
          />
          <Button variant="destructive" disabled={confirmDelete !== "DELETE"}>
            Delete my account
          </Button>
        </div>
      </Panel>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function SaveButton({ done, label = "Save" }: { done: boolean; label?: string }) {
  return (
    <Button type="submit">
      {done ? (
        <>
          <Check className="size-4" /> Saved
        </>
      ) : (
        label
      )}
    </Button>
  );
}
