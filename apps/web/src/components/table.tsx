import { Box, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'

export type TableProps<TRows extends unknown[]> = {
  columns: Array<{
    id: string
    textAlign?: 'left' | 'right' | 'center'
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
  skeletonRows: number
  isLoading: boolean
  errorMessage: string | undefined
  noDataMessage?: string
}

export function Table<T extends unknown[]>({
  columns,
  rows,
  skeletonRows,
  isLoading,
  errorMessage,
  noDataMessage
}: TableProps<T>) {
  if (!isLoading && errorMessage) return <Text>{errorMessage}</Text>

  if (!isLoading && !rows.length) return <Text>{noDataMessage}</Text>

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <Box>
            <Box display="flex" gap={4}>
              {columns.map((column, index) => {
                return (
                  <Box
                    key={column.id}
                    textAlign={column.textAlign}
                    flex={1}
                    mb={4}
                  >
                    {column.headingCell.skeleton()}
                  </Box>
                )
              })}
            </Box>
          </Box>
          <Box>
            {new Array(skeletonRows).fill(null).map((_, index) => {
              return (
                <Box display="flex" key={index} gap={4}>
                  {columns.map(column => {
                    return (
                      <Box
                        key={column.id}
                        textAlign={column.textAlign}
                        flex={1}
                        mb={4}
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
          <Box display="flex" gap={4}>
            {columns.map((column, index) => {
              return (
                <Box
                  key={column.id}
                  textAlign={column.textAlign}
                  flex={1}
                  mb={4}
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
            return (
              <Box key={index} display="flex" gap={4}>
                {columns.map((column, index) => {
                  return (
                    <Box
                      key={column.id}
                      textAlign={column.textAlign}
                      flex={1}
                      mb={4}
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

  return <Box>{renderContent()}</Box>
}
