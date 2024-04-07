import {
  Box,
  TableCellProps,
  TableColumnHeaderProps,
  Table as TableComponent,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import { ReactNode } from 'react'

export type TableProps<TRows extends unknown[]> = {
  columns: Array<{
    id: string
    width?: number
    textAlign?: 'left' | 'right' | 'center'
    headingCell: {
      props?: TableColumnHeaderProps
      content: (rows: TRows) => ReactNode
    }
    rowCell: {
      props?: TableCellProps
      content: (row: TRows[0]) => ReactNode
    }
    rowCellSkeleton: () => ReactNode
  }>
  rows: TRows
  isLoading: boolean
  emptyRowsMessage?: string
}

export function Table<T extends unknown[]>({
  columns,
  rows,
  isLoading,
  emptyRowsMessage
}: TableProps<T>) {
  if (!isLoading && !rows.length) return <Text>{emptyRowsMessage}</Text>

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <Thead>
            <Tr>
              {columns.map(column => {
                return (
                  <Th
                    {...column.headingCell.props}
                    key={column.id}
                    width={column.width}
                    textAlign={column.textAlign}
                  >
                    <Box width={column.width} textTransform="none">
                      {column.headingCell.content(rows)}
                    </Box>
                  </Th>
                )
              })}
            </Tr>
          </Thead>
          <Tbody>
            {new Array(10).fill(null).map((_, index) => {
              return (
                <Tr key={index}>
                  {columns.map(column => {
                    return (
                      <Td
                        {...column.rowCell.props}
                        key={column.id}
                        width={column.width}
                        textAlign={column.textAlign}
                      >
                        <Box width={column.width}>
                          {column.rowCellSkeleton()}
                        </Box>
                      </Td>
                    )
                  })}
                </Tr>
              )
            })}
          </Tbody>
        </>
      )
    }

    return (
      <>
        <Thead>
          <Tr>
            {columns.map(column => {
              return (
                <Th
                  {...column.headingCell.props}
                  key={column.id}
                  width={column.width}
                  textAlign={column.textAlign}
                >
                  <Box width={column.width} textTransform="none">
                    {column.headingCell.content(rows)}
                  </Box>
                </Th>
              )
            })}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row, index) => {
            return (
              <Tr key={index}>
                {columns.map(column => {
                  return (
                    <Td
                      {...column.rowCell.props}
                      key={column.id}
                      width={column.width}
                      textAlign={column.textAlign}
                    >
                      <Box width={column.width}>
                        {column.rowCell.content(row)}
                      </Box>
                    </Td>
                  )
                })}
              </Tr>
            )
          })}
        </Tbody>
      </>
    )
  }

  return (
    <TableContainer>
      <TableComponent size="sm" variant="simple">
        {renderContent()}
      </TableComponent>
    </TableContainer>
  )
}
