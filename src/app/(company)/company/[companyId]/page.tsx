export default function Page({ params }: { params: { companyId: string } }) {
    return (
        <div style={{ padding: 24 }}>
        <h1>Company Dashboard</h1>
        <p>companyId: <b>{params.companyId}</b></p>
        </div>
    );
}