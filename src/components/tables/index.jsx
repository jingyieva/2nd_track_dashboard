// src/components/tables/index.jsx
import { useNavigate } from "react-router-dom";

import { Button } from '@/components/ui/button';
import { Table, 
    TableHeader, 
    TableBody, 
    TableRow, 
    TableCell, 
    TableHead 
} from "@/components/ui/table";


const CustomTable = ({ name = 'tabledata', columns, datas, emptyDataMsg = 'No data found.' }) => {
    const navigate = useNavigate();

    if(!columns || columns.length === 0) {
        return <>Table Display Error: Please check columns definition.</>
    }

    const renderDataColumn = (column, data) => {
        let result = null;

        if (column.render) {
            result = column.render({ rowData: data, column });
        }
        else if (column.formatter) {
            result = column.formatter({ value: data[column.key]});
        }
        else {
            result = data?.[column.key];
        }

        return result;
    }


    return (
        <Table>
            <TableHeader>
            <TableRow>
                {
                    columns.map((column) => (
                        <TableHead key={`table-header-${column.key}`}>{column.name}</TableHead>
                    ))
                }
            </TableRow>
            </TableHeader>
            <TableBody>
                {(datas && datas.length > 0 ) 
                    ? (
                        datas.map((data, index) => (
                            <TableRow key={`table-row-${index}`}>
                                {
                                    columns.map((column) => (
                                        <TableCell key={`table-row-${index}-cell-${column.key}`}>
                                            {
                                                column.key === 'operation' ? (
                                                    column?.actions?.map((action) => (
                                                        <Button
                                                            key={action.id}
                                                            onClick={() => action.action({ navigate, data })}
                                                        >
                                                            詳細
                                                        </Button>
                                                    ))
                                                ) : (
                                                    <span>
                                                        {renderDataColumn(column, data)}
                                                    </span>
                                                )
                                            }
                                        </TableCell>
                                    )
                                )}
                            </TableRow>
                    )))
                    : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-4">
                                {emptyDataMsg}
                            </TableCell>
                        </TableRow>
                    )
                }
            </TableBody>
        </Table>
    );    
}

export default CustomTable;