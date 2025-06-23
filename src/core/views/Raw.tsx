import { observer } from "mobx-react";
import { useState } from "react";
import { fetchGitHubUsers } from "../../hooks/getUsers";
import { useQuery } from "@tanstack/react-query";

export const RawApiOutputView = observer(() => {
    // @ts-ignore
    const [limit, setLimit] = useState(20);
    // @ts-ignore
    const [since, setSince] = useState(0);

    const { data: users, isLoading, error } = useQuery({
        queryKey: ['github-users', { since, limit }],
        queryFn: () => fetchGitHubUsers({ since, per_page: limit }),
    })


    if (isLoading) { return <div>Loading...</div> }
    if (error) { return <div>Error Fetching the data...</div> }

    return (
        <section>
            <pre>{JSON.stringify(users, null, 4)}</pre>
        </section>

    );
});
