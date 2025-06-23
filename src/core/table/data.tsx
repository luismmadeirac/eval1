import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { fetchGitHubUsers } from '../../hooks/getUsers';
import { UserModal } from './UserDataModal';
import "./table.css";
import { useTranslation } from '../i18n/hooks/use-translation';
import { observer } from 'mobx-react';

export interface UserDetails {
    login: string;
    name?: string;
    company?: string;
    blog?: string;
    bio?: string;
}

const columns: ColumnDef<any>[] = [
    {
        header: 'ID',
        accessorKey: 'id',
    },
    {
        header: 'Username',
        accessorKey: 'login',
    },
    {
        header: 'Avatar',
        accessorKey: 'avatar_url',
        cell: info => (
            <img
                // @ts-ignore
                src={info.getValue()}
                alt="avatar"
                style={{ width: '30px', borderRadius: '50%' }}
            />
        ),
    },
    {
        header: 'Profile URL',
        accessorKey: 'html_url',
        cell: info => (
            // @ts-ignore
            <a href={info.getValue()} target="_blank" rel="noopener noreferrer">
                GitHub Profile
            </a>
        ),
    },
    {
        id: 'readMore',
        header: 'Read More',
        cell: ({ row }) => (
            <UserModal login={row.original.login} />
        ),
    },
];

export const Table = observer(() => {
    const { t } = useTranslation();
    const [limit, setLimit] = useState(20);
    const [since, setSince] = useState(0);
    const [lastFetchedIds, setLastFetchedIds] = useState<number[]>([]); // Stack to go back

    const { data: users, isLoading, isError, error } = useQuery({
        queryKey: ['github-users', { since, limit }],
        queryFn: () => fetchGitHubUsers({ since, per_page: limit }),
    })

    const table = useReactTable({
        // @ts-ignore
        data: users ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleNext = () => {
        if (users && users.length > 0) {
            const lastId = users[users.length - 1].id;
            setLastFetchedIds(prev => [...prev, since]);
            setSince(lastId);
        }
    };

    const handlePrevious = () => {
        setLastFetchedIds(prev => {
            const prevStack = [...prev];
            const last = prevStack.pop();
            if (last !== undefined) {
                setSince(last);
            }
            return prevStack;
        });
    };

    if (isLoading) return <div>Loading users...</div>;

    if (isError) return <div>Error: {(error as Error).message}</div>;

    return (
        <div>
            <div className="table-controls">
                <select
                    value={limit}
                    onChange={e => {
                        setSince(0);
                        setLastFetchedIds([]);
                        setLimit(Number(e.target.value));
                    }}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>

                <button className='button button-block button-secondary-neutral' onClick={handlePrevious} disabled={lastFetchedIds.length === 0}>
                    {t('button.previous')}
                </button>
                <button className='button button-block button-neutral' onClick={handleNext}>
                    {t('button.next')}
                </button>
            </div>

            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

