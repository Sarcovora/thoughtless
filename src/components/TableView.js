import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

const columns = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone Number" },
    { key: "favorite_color", label: "Favorite Color" },
  ];
  
  const rows = [
    { id: 1, name: "Bob", phone: "123-456-7890", favorite_color: "Red" },
    { id: 2, name: "Joe", phone: "987-654-3210", favorite_color: "Orange" },
    { id: 3, name: "Sue", phone: "555-123-4567", favorite_color: "Blue" },
    // Add more rows as needed
  ];
  

export default function TableView() {
  return (
    <Table aria-label="Example table with dynamic content">
      <TableHeader>
        {columns.map((column) =>
          <TableColumn key={column.key}>{column.label}</TableColumn>
        )}
      </TableHeader>
      <TableBody>
        {rows.map((row) =>
          <TableRow key={row.id}>
            {columns.map((column) =>
              <TableCell key={`${row.id}-${column.key}`}>{row[column.key]}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
