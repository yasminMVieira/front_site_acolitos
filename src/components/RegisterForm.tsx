import React, { useRef, useState } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';

const RegisterForm: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: boolean; birthdate?: boolean; email?: boolean }>({});

  const validateForm = () => {
    const newErrors: { name?: boolean; birthdate?: boolean; email?: boolean } = {};
    if (!name) newErrors.name = true;
    if (!birthdate) newErrors.birthdate = true;
    if (!email) newErrors.email = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.current?.show({ severity: 'warn', summary: 'Atenção', detail: 'Todos os campos são obrigatórios!', life: 3000 });
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/users`, { name, birthdate, email });
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Usuário cadastrado com sucesso!', life: 3000 });
      setName('');
      setBirthdate(null);
      setEmail('');
      setErrors({});
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar usuário', life: 3000 });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <Toast ref={toast} position="top-center" />
      <div className="glass-card w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src={`${process.env.PUBLIC_URL}/logo_acolito.png`} 
            alt="Logo Acólitos" 
            className="w-20 h-20 md:w-24 md:h-24 object-contain animate-pulse-glow rounded-full p-1" 
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
          Cadastro de Acólito
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="flex items-center gap-2 text-white/80 font-medium mb-2">
              <i className="pi pi-user text-primary-light"></i>
              Nome
            </label>
            <InputText 
              id="name" 
              type="text" 
              placeholder="Nome Completo" 
              className={`input-dark ${errors.name ? 'border-red-500 ring-red-500/20' : ''}`}
              value={name} 
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: false }));
              }}
            />
          </div>
          
          {/* Birthdate Field */}
          <div>
            <label htmlFor="birthdate" className="flex items-center gap-2 text-white/80 font-medium mb-2">
              <i className="pi pi-calendar text-primary-light"></i>
              Data de Nascimento
            </label>
            <Calendar 
              id="birthdate" 
              className={`w-full ${errors.birthdate ? '[&_.p-inputtext]:border-red-500' : ''}`}
              inputClassName="input-dark"
              value={birthdate} 
              placeholder="dd/mm/yyyy" 
              dateFormat="dd/mm/yy" 
              touchUI
              showIcon
              onChange={(e) => {
                setBirthdate(e.value as Date | null);
                if (errors.birthdate) setErrors(prev => ({ ...prev, birthdate: false }));
              }} 
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="flex items-center gap-2 text-white/80 font-medium mb-2">
              <i className="pi pi-envelope text-primary-light"></i>
              E-mail
            </label>
            <InputText 
              id="email" 
              type="email" 
              placeholder="E-mail" 
              className={`input-dark ${errors.email ? 'border-red-500 ring-red-500/20' : ''}`}
              value={email} 
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: false }));
              }} 
            />
          </div>

          {/* Submit Button */}
          <Button 
            label={isLoading ? "Cadastrando..." : "Cadastrar"} 
            icon={isLoading ? "pi pi-spin pi-spinner" : "pi pi-user-plus"} 
            className="btn-gradient w-full mt-6" 
            type='submit'
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;