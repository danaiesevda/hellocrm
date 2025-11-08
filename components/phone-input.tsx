"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface Country {
  code: string
  name: string
  flag: string
}

const countries: Country[] = [
  { code: "+1", name: "United States / Canada", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "+47", name: "Norway", flag: "🇳🇴" },
  { code: "+45", name: "Denmark", flag: "🇩🇰" },
  { code: "+358", name: "Finland", flag: "🇫🇮" },
  { code: "+32", name: "Belgium", flag: "🇧🇪" },
  { code: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "+353", name: "Ireland", flag: "🇮🇪" },
  { code: "+48", name: "Poland", flag: "🇵🇱" },
  { code: "+420", name: "Czech Republic", flag: "🇨🇿" },
  { code: "+36", name: "Hungary", flag: "🇭🇺" },
  { code: "+40", name: "Romania", flag: "🇷🇴" },
  { code: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "+54", name: "Argentina", flag: "🇦🇷" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "+66", name: "Thailand", flag: "🇹🇭" },
  { code: "+84", name: "Vietnam", flag: "🇻🇳" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "+63", name: "Philippines", flag: "🇵🇭" },
]

interface PhoneInputProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function PhoneInput({ value = "", onChange, placeholder, className }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0])
  const [phoneNumber, setPhoneNumber] = useState("")

  // Parse existing value if provided
  useEffect(() => {
    if (value) {
      const sortedCountries = [...countries].sort((a, b) => b.code.length - a.code.length)
      const matchedCountry = sortedCountries.find((c) => value.startsWith(c.code))
      if (matchedCountry) {
        setSelectedCountry(matchedCountry)
        setPhoneNumber(value.replace(matchedCountry.code, "").trim())
      } else {
        setPhoneNumber(value)
      }
    }
  }, [value])

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode)
    if (country) {
      setSelectedCountry(country)
      const fullNumber = country.code + (phoneNumber ? " " + phoneNumber : "")
      onChange(fullNumber)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    // Extract just the number part (after the country code)
    if (inputValue.startsWith(selectedCountry.code)) {
      const numberPart = inputValue.slice(selectedCountry.code.length).trim()
      // Only allow digits, spaces, and dashes
      const cleaned = numberPart.replace(/[^\d\s-]/g, "")
      setPhoneNumber(cleaned)
      onChange(selectedCountry.code + (cleaned ? " " + cleaned : ""))
    }
  }

  return (
    <div className={cn("relative flex items-center w-full max-w-[300px]", className)}>
      <div className="relative flex items-center w-full border border-crm-border rounded-md bg-crm-bg overflow-hidden focus-within:ring-2 focus-within:ring-crm-primary focus-within:border-crm-primary transition-all">
        {/* Flag Dropdown */}
        <div className="flex items-center border-r border-crm-border bg-crm-bg px-2 py-2">
          <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
            <SelectTrigger className="w-auto h-auto border-0 bg-transparent p-0 gap-1 focus:ring-0 focus:ring-offset-0 [&>svg]:hidden">
              <span className="text-lg leading-none">{selectedCountry.flag}</span>
              <ChevronDown className="w-3 h-3 text-crm-text-secondary" />
            </SelectTrigger>
            <SelectContent className="!bg-crm-surface border-crm-border max-h-[300px] z-[300] !opacity-100" style={{ backgroundColor: 'var(--color-crm-surface)', opacity: 1 }}>
              {countries.map((country) => (
                <SelectItem
                  key={`${country.code}-${country.name}`}
                  value={country.code}
                  className="text-crm-text-primary cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{country.flag}</span>
                    <span className="font-medium">{country.code}</span>
                    <span className="text-crm-text-secondary text-sm">{country.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={selectedCountry.code + (phoneNumber ? " " + phoneNumber : "")}
          onChange={handleInputChange}
          className="flex-1 bg-transparent border-0 px-3 py-2 text-crm-text-primary focus:outline-none focus:ring-0 placeholder:text-crm-text-tertiary text-sm"
          placeholder={`${selectedCountry.code} ${placeholder || "555 123 4567"}`}
        />
      </div>
    </div>
  )
}
