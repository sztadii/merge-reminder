import { Alert, AlertIcon, Box, Skeleton, Text } from '@chakra-ui/react'
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
      content: (rows: TRows) => ReactNode
    }
    rowCell: {
      content: (row: TRows[0]) => ReactNode
    }
  }>
  rows: TRows
  numberOfVisibleRows: number
  isLoading: boolean
  errorMessage: string | undefined
  noDataMessage?: string
}

export function Table<T extends unknown[]>({
  columns,
  rows,
  numberOfVisibleRows,
  isLoading,
  errorMessage,
  noDataMessage
}: TableProps<T>) {
  const rowHeight = 24
  const marginBottom = 16
  const marginBottomInPx = marginBottom + 'px'
  const rowHeightPx = rowHeight + 'px'

  const rowsSpace = rowHeight * numberOfVisibleRows
  const marginsSpace = marginBottom * numberOfVisibleRows
  const contentHeight = rowsSpace + marginsSpace

  const headerSpace = rowHeight + marginsSpace
  const tableHeight = headerSpace + rowsSpace + marginBottom

  function renderContent() {
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

    if (isLoading) {
      const skeletonRows = new Array(numberOfVisibleRows).fill(null)
      return (
        <>
          <Box>
            <Box display="flex" gap={4} mb={marginBottomInPx}>
              {columns.map((column, index) => {
                return (
                  <Box
                    key={column.id}
                    textAlign={column.textAlign}
                    flex={1}
                    minWidth={column.width}
                    height={rowHeightPx}
                  >
                    <Skeleton height={rowHeightPx} />
                  </Box>
                )
              })}
            </Box>
          </Box>

          <Box>
            {skeletonRows.map((_, index) => {
              const isLast = skeletonRows.length - 1 === index
              return (
                <Box
                  display="flex"
                  key={index}
                  gap={4}
                  mb={isLast ? 0 : marginBottomInPx}
                >
                  {columns.map(column => {
                    return (
                      <Box
                        key={column.id}
                        textAlign={column.textAlign}
                        flex={1}
                        minWidth={column.width}
                        height={rowHeightPx}
                      >
                        <Skeleton height={rowHeightPx} />
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
          <Box display="flex" gap={4} mb={marginBottomInPx}>
            {columns.map((column, index) => {
              return (
                <Box
                  key={column.id}
                  textAlign={column.textAlign}
                  flex={1}
                  minWidth={column.width}
                  height={rowHeightPx}
                >
                  <Text fontWeight="500">
                    {column.headingCell.content(rows)}
                  </Text>
                </Box>
              )
            })}
          </Box>
        </Box>
        <Box height={contentHeight + 'px'}>
          {rows.map((row, index) => {
            const isLast = rows.length - 1 === index
            return (
              <Box
                key={index}
                display="flex"
                gap={4}
                mb={isLast ? 0 : marginBottomInPx}
              >
                {columns.map((column, index) => {
                  return (
                    <Box
                      key={column.id}
                      textAlign={column.textAlign}
                      flex={1}
                      minWidth={column.width}
                      height={rowHeightPx}
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
    <Box overflow="auto">
      <Box height={tableHeight}>{renderContent()}</Box>
    </Box>
  )
}
