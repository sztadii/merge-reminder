import {
  Alert,
  AlertIcon,
  Box,
  Text,
  useBreakpointValue
} from '@chakra-ui/react'
import { ReactNode } from 'react'

type Breakpoints = {
  base: string
  xs?: string
  sm?: string
  md?: string
  lg?: string
  xl?: string
}

export type TableProps<TRows extends unknown[]> = {
  columns: Array<{
    id: string
    textAlign?: 'left' | 'right' | 'center'
    width?: Breakpoints
    headingCell: {
      skeleton: () => ReactNode
      content: (rows: TRows) => ReactNode
    }
    rowCell: {
      skeleton: () => ReactNode
      content: (row: TRows[0]) => ReactNode
    }
  }>
  rows: TRows
  numberOfSkeletonRows: number
  isLoading: boolean
  errorMessage: string | undefined
  noDataMessage?: string
}

export function Table<T extends unknown[]>({
  columns,
  rows,
  numberOfSkeletonRows,
  isLoading,
  errorMessage,
  noDataMessage
}: TableProps<T>) {
  // On the phones, where table has a scroll we do not want to hide the content.
  // So we need a small padding.
  // For larger devices we do not need it.
  const paddingBottomValue = useBreakpointValue({
    base: '20px',
    lg: undefined
  })

  if (!isLoading && errorMessage)
    return (
      <Alert status="error">
        <AlertIcon />
        {errorMessage}
      </Alert>
    )

  if (!isLoading && !rows.length)
    return (
      <Alert status="success">
        <AlertIcon /> {noDataMessage}
      </Alert>
    )

  function renderContent() {
    if (isLoading) {
      const skeletonRows = new Array(numberOfSkeletonRows).fill(null)
      return (
        <>
          <Box>
            <Box display="flex" gap={4} mb={4}>
              {columns.map((column, index) => {
                return (
                  <Box
                    key={column.id}
                    textAlign={column.textAlign}
                    flex={1}
                    minWidth={column.width}
                  >
                    {column.headingCell.skeleton()}
                  </Box>
                )
              })}
            </Box>
          </Box>
          <Box>
            {skeletonRows.map((_, index) => {
              const isLast = skeletonRows.length - 1 === index
              return (
                <Box display="flex" key={index} gap={4} mb={isLast ? 0 : 4}>
                  {columns.map(column => {
                    return (
                      <Box
                        key={column.id}
                        textAlign={column.textAlign}
                        flex={1}
                        minWidth={column.width}
                      >
                        {column.rowCell.skeleton()}
                      </Box>
                    )
                  })}
                </Box>
              )
            })}
          </Box>
        </>
      )
    }

    return (
      <>
        <Box>
          <Box display="flex" gap={4} mb={4}>
            {columns.map((column, index) => {
              return (
                <Box
                  key={column.id}
                  textAlign={column.textAlign}
                  flex={1}
                  minWidth={column.width}
                >
                  <Text fontWeight="bold">
                    {column.headingCell.content(rows)}
                  </Text>
                </Box>
              )
            })}
          </Box>
        </Box>
        <Box>
          {rows.map((row, index) => {
            const isLast = rows.length - 1 === index
            return (
              <Box key={index} display="flex" gap={4} mb={isLast ? 0 : 4}>
                {columns.map((column, index) => {
                  return (
                    <Box
                      key={column.id}
                      textAlign={column.textAlign}
                      flex={1}
                      minWidth={column.width}
                    >
                      {column.rowCell.content(row)}
                    </Box>
                  )
                })}
              </Box>
            )
          })}
        </Box>
      </>
    )
  }

  return (
    <Box overflow="auto" pb={paddingBottomValue}>
      {renderContent()}
    </Box>
  )
}
