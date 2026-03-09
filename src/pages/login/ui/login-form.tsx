import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { AudioLines, Eye, EyeOff, Lock, User, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '~/app/auth-provider'
import { AuthApiError, loginUser } from '~/shared/api/auth'
import { Button } from '~/shared/ui/button'
import { Card, CardContent, CardHeader } from '~/shared/ui/card'
import { Checkbox } from '~/shared/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '~/shared/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '~/shared/ui/input-group'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { login } = useAuth()

  const loginMutation = useMutation({
    mutationFn: loginUser,
  })

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)

      try {
        const response = await loginMutation.mutateAsync({
          username: value.username.trim(),
          password: value.password,
        })

        login(response, value.rememberMe)
        void navigate('/products', { replace: true })
      } catch (error) {
        if (error instanceof AuthApiError) {
          setSubmitError(error.message)
          return
        }

        setSubmitError('Не удалось войти. Попробуйте еще раз.')
      }
    },
  })

  return (
    <Card>
      <CardHeader>
        <Link to="#" className="flex items-center justify-center">
          <div className="flex size-13 items-center justify-center rounded-full text-foreground">
            <AudioLines className="size-8" />
          </div>
        </Link>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <FieldGroup>
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-2xl font-bold">Добро пожаловать!</h1>
              <p className="text-sm text-balance text-muted-foreground">
                Пожалуйста, авторизуйтесь
              </p>
            </div>

            <form.Field
              name="username"
              validators={{
                onChange: ({ value }) =>
                  value.trim().length > 0 ? undefined : 'Введите логин',
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Логин</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        placeholder="Введите логин"
                        autoComplete="username"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                      />

                      <InputGroupAddon>
                        <User />
                      </InputGroupAddon>

                      {field.state.value && (
                        <InputGroupAddon align={'inline-end'}>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Clear username"
                            onClick={() => {
                              field.handleChange('')
                              form.setFieldValue('password', '')
                            }}
                            className={'hover:bg-transparent'}
                          >
                            <X />
                          </Button>
                        </InputGroupAddon>
                      )}
                    </InputGroup>

                    {isInvalid && (
                      <FieldError
                        errors={field.state.meta.errors.map((error) => ({
                          message: error?.toString(),
                        }))}
                      />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => {
                  if (!value.trim()) {
                    return 'Введите пароль'
                  }

                  return undefined
                },
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>Пароль</FieldLabel>
                      <Link
                        to="#"
                        className="ml-auto text-sm text-foreground underline-offset-4 hover:underline"
                      >
                        Забыли пароль?
                      </Link>
                    </div>

                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Введите пароль"
                        autoComplete="current-password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />

                      <InputGroupAddon>
                        <Lock />
                      </InputGroupAddon>

                      <InputGroupAddon align={'inline-end'}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                          className={'hover:bg-transparent'}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>

                    {isInvalid ? (
                      <FieldError
                        errors={field.state.meta.errors.map((error) => ({
                          message: error?.toString(),
                        }))}
                      />
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="rememberMe">
              {(field) => (
                <Field orientation="horizontal">
                  <Checkbox
                    id={field.name}
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                  />
                  <FieldLabel htmlFor={field.name}>Запомнить данные</FieldLabel>
                </Field>
              )}
            </form.Field>

            <Field>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? 'Входим...' : 'Войти'}
                  </Button>
                )}
              </form.Subscribe>
              {submitError ? (
                <FieldError errors={[{ message: submitError }]} />
              ) : null}
            </Field>
            <FieldSeparator className='*:data-[slot="field-separator-content"]:bg-card'>
              Или продолжить с
            </FieldSeparator>
            <Field>
              <Button variant="outline" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                    fill="currentColor"
                  />
                </svg>
                Войти с GitHub
              </Button>
              <FieldDescription className="text-center">
                Нет аккаунта?{' '}
                <Link to="#" className="underline underline-offset-4">
                  Создать
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
