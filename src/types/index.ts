export type WithPromise<T> = Promise<T>

export type SearchParamsProps<T> = {
  searchParams: WithPromise<T>
}

export type ParamsProps<T> = {
  params: WithPromise<T>
}
