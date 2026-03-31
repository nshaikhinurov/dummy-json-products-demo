import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { CreateProductPayload } from '~/shared/api/products'
import { getProductCategories, ProductsApiError } from '~/shared/api/products'
import { isFieldInvalid, toFieldErrors } from '~/shared/lib/form-field'
import { Button } from '~/shared/ui/button'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '~/shared/ui/combobox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/shared/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/shared/ui/field'
import { Input } from '~/shared/ui/input'

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (value: CreateProductPayload) => Promise<void>
  isSubmitting: boolean
}

export function AddProductDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: AddProductDialogProps) {
  const { t } = useTranslation()

  const categoriesQuery = useQuery({
    queryKey: ['products-categories'],
    queryFn: getProductCategories,
    staleTime: 10 * 60 * 1000,
  })

  const form = useForm({
    defaultValues: {
      title: '',
      price: '',
      brand: '',
      sku: '',
      category: '',
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        title: value.title.trim(),
        price: Number(value.price),
        brand: value.brand.trim(),
        sku: value.sku.trim(),
        category: value.category.trim(),
      })

      form.reset()
    },
  })

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [form, open])

  const categories = categoriesQuery.data ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('products.addDialogTitle')}</DialogTitle>
          <DialogDescription>
            {t('products.addDialogDescription')}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <FieldGroup className="gap-4">
            <form.Field
              name="title"
              validators={{
                onChange: ({ value }) =>
                  value.trim().length > 0
                    ? undefined
                    : t('products.addValidationTitleRequired'),
              }}
            >
              {(field) => {
                const isInvalid = isFieldInvalid(field.state.meta)

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t('products.addFieldTitleLabel')}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder={t('products.addFieldTitlePlaceholder')}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      maxLength={120}
                      autoComplete="off"
                    />
                    {isInvalid ? (
                      <FieldError
                        errors={toFieldErrors(field.state.meta.errors)}
                      />
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field
              name="price"
              validators={{
                onChange: ({ value }) => {
                  if (!value.trim()) {
                    return t('products.addValidationPriceRequired')
                  }

                  const parsed = Number(value)
                  if (!Number.isFinite(parsed) || parsed <= 0) {
                    return t('products.addValidationPriceRequired')
                  }

                  return undefined
                },
              }}
            >
              {(field) => {
                const isInvalid = isFieldInvalid(field.state.meta)

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t('products.addFieldPriceLabel')}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={field.state.value}
                      placeholder={t('products.addFieldPricePlaceholder')}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid ? (
                      <FieldError
                        errors={toFieldErrors(field.state.meta.errors)}
                      />
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field
              name="brand"
              validators={{
                onChange: ({ value }) =>
                  value.trim().length > 0
                    ? undefined
                    : t('products.addValidationBrandRequired'),
              }}
            >
              {(field) => {
                const isInvalid = isFieldInvalid(field.state.meta)

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t('products.addFieldBrandLabel')}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder={t('products.addFieldBrandPlaceholder')}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      maxLength={80}
                    />
                    {isInvalid ? (
                      <FieldError
                        errors={toFieldErrors(field.state.meta.errors)}
                      />
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field
              name="sku"
              validators={{
                onChange: ({ value }) =>
                  value.trim().length > 0
                    ? undefined
                    : t('products.addValidationSkuRequired'),
              }}
            >
              {(field) => {
                const isInvalid = isFieldInvalid(field.state.meta)

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t('products.addFieldSkuLabel')}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder={t('products.addFieldSkuPlaceholder')}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      maxLength={64}
                    />
                    {isInvalid ? (
                      <FieldError
                        errors={toFieldErrors(field.state.meta.errors)}
                      />
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field
              name="category"
              validators={{
                onChange: ({ value }) =>
                  value.trim().length > 0
                    ? undefined
                    : t('products.addValidationCategoryRequired'),
              }}
            >
              {(field) => {
                const isInvalid = isFieldInvalid(field.state.meta)

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t('products.addFieldCategoryLabel')}
                    </FieldLabel>

                    <Combobox
                      items={categories}
                      value={field.state.value || null}
                      onValueChange={(value) => field.handleChange(value ?? '')}
                      disabled={categoriesQuery.isPending}
                    >
                      <ComboboxInput
                        id={field.name}
                        name={field.name}
                        placeholder={
                          categoriesQuery.isPending
                            ? t('products.addFieldCategoryLoading')
                            : t('products.addFieldCategoryPlaceholder')
                        }
                        aria-invalid={isInvalid}
                        showClear
                        className="*:data-[slot=input-group-control]:capitalize"
                      />

                      <ComboboxContent>
                        <ComboboxEmpty>
                          {t('products.addFieldCategoryEmpty')}
                        </ComboboxEmpty>
                        <ComboboxList>
                          {(item: string) => (
                            <ComboboxItem
                              key={item}
                              value={item}
                              className={'capitalize'}
                            >
                              {item}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>

                    {categoriesQuery.error instanceof ProductsApiError ? (
                      <FieldError
                        errors={[{ message: categoriesQuery.error.message }]}
                      />
                    ) : null}

                    {isInvalid ? (
                      <FieldError
                        errors={toFieldErrors(field.state.meta.errors)}
                      />
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t('products.addCancelButton')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || categoriesQuery.isPending}
            >
              {isSubmitting
                ? t('products.addSubmitLoading')
                : t('products.addSubmitButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
