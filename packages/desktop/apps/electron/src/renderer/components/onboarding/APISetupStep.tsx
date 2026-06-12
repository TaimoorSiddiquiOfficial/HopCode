import { Check, SquareTerminal } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { StepFormLayout, BackButton, ContinueButton } from "./primitives"
import type { LlmAuthType, LlmProviderType } from "@craft-agent/shared/config/llm-connections"

export type ProviderSegment = 'hopcode'
export type ApiSetupMethod = 'HOPCODE_code'

export function apiSetupMethodToConnectionTypes(_method: ApiSetupMethod): {
  providerType: LlmProviderType;
  authType: LlmAuthType;
} {
  return { providerType: 'hopcode', authType: 'none' }
}

interface APISetupStepProps {
  selectedMethod: ApiSetupMethod | null
  onSelect: (method: ApiSetupMethod) => void
  onContinue: () => void
  onBack: () => void
  initialSegment?: ProviderSegment
}

export function APISetupStep({
  selectedMethod,
  onSelect,
  onContinue,
  onBack,
}: APISetupStepProps) {
  const { t } = useTranslation()
  const isSelected = selectedMethod === 'HOPCODE_code'

  return (
    <StepFormLayout
      title={t("onboarding.apiSetup.title")}
      description={t("onboarding.apiSetup.HopCodeDescription")}
      actions={
        <>
          <BackButton onClick={onBack} />
          <ContinueButton onClick={onContinue} disabled={!selectedMethod} />
        </>
      }
    >
      <button
        onClick={() => onSelect('HOPCODE_code')}
        className={cn(
          "flex w-full items-start gap-4 rounded-xl p-4 text-left transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "hover:bg-foreground/[0.02] shadow-minimal",
          isSelected ? "bg-background" : "bg-foreground-2"
        )}
      >
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            isSelected ? "bg-foreground/10 text-foreground" : "bg-muted text-muted-foreground"
          )}
        >
          <SquareTerminal className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">
            {t("onboarding.apiSetup.HopCodeName")}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("onboarding.apiSetup.HopCodeDetail")}
          </p>
        </div>
        <div
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            isSelected
              ? "border-foreground bg-foreground text-background"
              : "border-muted-foreground/20"
          )}
        >
          {isSelected && <Check className="size-3" strokeWidth={3} />}
        </div>
      </button>
    </StepFormLayout>
  )
}
