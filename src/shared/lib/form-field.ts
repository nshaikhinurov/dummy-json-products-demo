interface FieldMetaLike {
  isTouched: boolean
  isValid: boolean
  errors?: unknown[]
}

export function isFieldInvalid(
  meta: Pick<FieldMetaLike, 'isTouched' | 'isValid'>
) {
  return meta.isTouched && !meta.isValid
}

export function toFieldErrors(errors?: unknown[]) {
  return (errors ?? []).map((error) => ({
    message: error?.toString(),
  }))
}
