"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center text-[#556378]">
          <h1 className="text-5xl font-bold">Resurv</h1>
        </div>
        <Field>
          <FieldLabel htmlFor="email" className="text-[#556378]">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" className="border border-[#556378]" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password" className="text-[#556378]">Password</FieldLabel>
          </div>
          <Input id="password" type="password" className="border border-[#556378]" required />
        </Field>
        <Field>
          <Button type="submit" className="w-full bg-[#556378] cursor-pointer" disabled={isLoading}> 
            {isLoading ? "Logging in..." : "Login"} 
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center text-[#556378]" >
            Don&apos;t have an account?{" "}
            <a href="#" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
