//Mutations để thực hiện các methods như REST API ta thường thực hiện (POST, PUT, UPDATE, PATCH, …)
import { useMutation } from "@tanstack/react-query"
// Nạp useMutation từ thư viện @tanstack/react-query

export const useMutationHooks = (fnCallback) => {
  const mutation = useMutation({
    mutationFn: fnCallback
  })
  return mutation
}