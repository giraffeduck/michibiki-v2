"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface FormData {
  // Step 1 - Required
  weekStartDay: string
  weight: string
  ftp: string

  // Step 2 - Optional
  gender: string
  birthDate: Date | undefined
  timeZone: string
  best5kmTime: string
  best400mTime: string
  email: string
}

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    weekStartDay: "",
    weight: "",
    ftp: "",
    gender: "",
    birthDate: undefined,
    timeZone: "Asia/Tokyo",
    best5kmTime: "",
    best400mTime: "",
    email: "",
  })

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isStep1Valid = () => {
    return formData.weekStartDay && formData.weight && formData.ftp
  }

  const handleNext = () => {
    if (isStep1Valid()) {
      setCurrentStep(2)
    }
  }

  const handleComplete = () => {
    console.log("Onboarding completed:", formData)
    // Here you would typically save the data and redirect to the main app
    alert("Michibikiへようこそ！プロフィールが設定されました。")
  }

  const timeZones = [
    "Asia/Tokyo",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Australia/Sydney",
    "Asia/Shanghai",
    "Asia/Seoul",
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Michibiki</h1>
          <div className="flex justify-center space-x-2 mb-4">
            <div className={cn("w-3 h-3 rounded-full", currentStep >= 1 ? "bg-primary" : "bg-slate-300")} />
            <div className={cn("w-3 h-3 rounded-full", currentStep >= 2 ? "bg-primary" : "bg-slate-300")} />
          </div>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl text-slate-700">
              {currentStep === 1
                ? "ようこそ！基本設定から始めましょう。"
                : "もう少しです！お好みで詳細情報を入力してください。"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStep === 1 ? (
              <>
                {/* Week Start Day */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700">週の開始曜日 *</Label>
                  <RadioGroup
                    value={formData.weekStartDay}
                    onValueChange={(value) => updateFormData("weekStartDay", value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monday" id="monday" />
                      <Label htmlFor="monday" className="text-sm">
                        月曜日
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sunday" id="sunday" />
                      <Label htmlFor="sunday" className="text-sm">
                        日曜日
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm font-medium text-slate-700">
                    体重 (kg) *
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={formData.weight}
                    onChange={(e) => updateFormData("weight", e.target.value)}
                    className="rounded-lg"
                  />
                </div>

                {/* FTP */}
                <div className="space-y-2">
                  <Label htmlFor="ftp" className="text-sm font-medium text-slate-700">
                    FTP (W) *
                  </Label>
                  <Input
                    id="ftp"
                    type="number"
                    placeholder="250"
                    value={formData.ftp}
                    onChange={(e) => updateFormData("ftp", e.target.value)}
                    className="rounded-lg"
                  />
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!isStep1Valid()}
                  className="w-full mt-8 rounded-lg h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  次へ
                </Button>
              </>
            ) : (
              <>
                {/* Gender */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">性別</Label>
                  <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="性別を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">男性</SelectItem>
                      <SelectItem value="female">女性</SelectItem>
                      <SelectItem value="other">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Birth Date */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">生年月日</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-lg",
                          !formData.birthDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.birthDate ? format(formData.birthDate, "PPP") : "日付を選択"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.birthDate}
                        onSelect={(date) => updateFormData("birthDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Zone */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">タイムゾーン</Label>
                  <Select value={formData.timeZone} onValueChange={(value) => updateFormData("timeZone", value)}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeZones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Best 5km Run Time */}
                <div className="space-y-2">
                  <Label htmlFor="best5km" className="text-sm font-medium text-slate-700">
                    5km走ベストタイム (HH:MM:SS)
                  </Label>
                  <Input
                    id="best5km"
                    placeholder="00:25:30"
                    value={formData.best5kmTime}
                    onChange={(e) => updateFormData("best5kmTime", e.target.value)}
                    className="rounded-lg"
                  />
                </div>

                {/* Best 400m Swim Time */}
                <div className="space-y-2">
                  <Label htmlFor="best400m" className="text-sm font-medium text-slate-700">
                    400m泳ベストタイム (MM:SS)
                  </Label>
                  <Input
                    id="best400m"
                    placeholder="08:30"
                    value={formData.best400mTime}
                    onChange={(e) => updateFormData("best400mTime", e.target.value)}
                    className="rounded-lg"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    メールアドレス
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="rounded-lg"
                  />
                </div>

                <div className="flex space-x-3 mt-8">
                  <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1 rounded-lg h-11">
                    戻る
                  </Button>
                  <Button
                    onClick={handleComplete}
                    className="flex-1 rounded-lg h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    保存してMichibikiを開始
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
