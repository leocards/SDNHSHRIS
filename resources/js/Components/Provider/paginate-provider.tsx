import { PAGINATEDDATA } from "@/Types"
import { getQueryParam } from "@/Types/types"
import { router } from "@inertiajs/react"
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react"

type PaginateState<T> = {
    page: PAGINATEDDATA<T>

    loading: boolean

    // query?: Record<string, unknown>

    onQuery: (_query: Record<string, unknown>) => void
    onNavigatePage: (pageNavigate: "next" | "prev" | string) => void
}

const PaginateContext = createContext<PaginateState<any>|undefined>(undefined)

type PaginateProviderProps<T> = PropsWithChildren & {
    pageValue: PAGINATEDDATA<T>
    url: string
}

export const PaginateProvider = <T,>({ pageValue, children, url }:PaginateProviderProps<T>) => {
    const [page, setPage] = useState<PAGINATEDDATA<T>>(pageValue)
    const [query, setQuery] = useState<Record<string, unknown>>()
    const [loading, setLoading] = useState(false)

    const onNavigatePage = (pageNavigate: "next" | "prev" | string) => {
        if(pageNavigate === "next") {
            setQuery({ ...query, page: getQueryParam(page.next_page_url, "page") ?? undefined })
        } else if(pageNavigate === "prev") {
            setQuery({ ...query, page: getQueryParam(page.prev_page_url, "page") ?? undefined })
        } else if(pageNavigate === "first") {
            setQuery({ ...query, page: getQueryParam(page.first_page_url, "page") ?? undefined })
        } else if(pageNavigate === "last") {
            setQuery({ ...query, page: getQueryParam(page.last_page_url, "page") ?? undefined })
        } else {
            setQuery({ ...query, page: getQueryParam(pageNavigate, "page") })
        }
    }

    const onQuery = (_query: Record<string, unknown>) => {
        setQuery({ ...query, ..._query})
    }

    useEffect(() => {
        if(query) {
            (async () => {
                setLoading(true)
                try {
                    const response = await window.axios.get<PAGINATEDDATA<T>>(url, {params: query})

                    setPage(response.data)

                    setLoading(false)
                } catch (error) {
                    console.error('Error fetching data:', error)
                    setLoading(false)
                }
            })()
        }
    }, [query])

    useEffect(() => {
        if(pageValue) {
            setPage(pageValue)
        }
    }, [pageValue])

    return (
        <PaginateContext.Provider value={{
            page,
            loading,
            onNavigatePage,
            onQuery,
        }}>
            {children}
        </PaginateContext.Provider>
    )
}

export const usePagination = <T,>() => {
    const context = useContext(PaginateContext as React.Context<PaginateState<T> | undefined>);

    if (!context) {
        throw new Error('usePagination must be used within a PaginateProvider');
    }

    return context;
};


