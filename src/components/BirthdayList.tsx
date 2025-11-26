import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

// Definição da interface do usuário
interface User {
  name: string;
  birthdate: string;
}

const BirthdayList: React.FC = () => {
  const [birthdays, setBirthdays] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const response = await axios.get<User[]>('https://back-site-acolitos.onrender.com/api/birthdays');
        setBirthdays(response.data);
      } catch (error) {
        console.error('Error fetching birthdays:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdays();
  }, []);
  
  const formatarData = (data: string | number | Date) => {
    return new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const nameBodyTemplate = (rowData: User) => {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {rowData.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-white">{rowData.name}</span>
      </div>
    );
  };

  const dateBodyTemplate = (rowData: User) => {
    return (
      <div className="flex items-center gap-2 text-white/80">
        <i className="pi pi-calendar text-primary-light text-sm"></i>
        <span>{formatarData(rowData.birthdate)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 pt-20 md:pt-24">
      <div className="glass-card w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
              Aniversariantes do Dia
            </h2>
            <p className="text-white/60 mt-1">
              {birthdays.length > 0 
                ? `${birthdays.length} aniversariante${birthdays.length > 1 ? 's' : ''} hoje!`
                : 'Nenhum aniversariante hoje'
              }
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
            <i className="pi pi-gift text-2xl text-white"></i>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <i className="pi pi-spin pi-spinner text-4xl text-primary-light mb-4"></i>
            <p className="text-white/60">Carregando aniversariantes...</p>
          </div>
        ) : birthdays.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 rounded-full bg-surface-light/50 flex items-center justify-center mb-4">
              <i className="pi pi-calendar-times text-4xl text-white/40"></i>
            </div>
            <h3 className="text-lg font-semibold text-white/80 mb-2">
              Nenhum aniversariante
            </h3>
            <p className="text-white/50 text-center">
              Não há aniversariantes registrados para hoje.
            </p>
          </div>
        ) : (
          /* Data Table */
          <div className="datatable-dark">
            <DataTable 
              value={birthdays} 
              paginator 
              rows={10} 
              tableStyle={{ minWidth: '100%' }}
              className="rounded-xl overflow-hidden"
              emptyMessage="Nenhum registro encontrado"
            >
              <Column 
                field="name" 
                header="Nome" 
                body={nameBodyTemplate}
                headerClassName="font-semibold"
              />
              <Column 
                field="birthdate" 
                header="Data de Nascimento" 
                body={dateBodyTemplate}
                headerClassName="font-semibold"
              />
            </DataTable>
          </div>
        )}
      </div>
    </div>
  );
}

export default BirthdayList;
