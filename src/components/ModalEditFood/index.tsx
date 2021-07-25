import { useRef } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';

import { Food } from '../../types';
import Modal from '../Modal';
import Input from '../Input';

import { Form } from './styles';

interface ModalEditFoodProps {
  isOpen: boolean;
  editingFood: Food;
  onRequestClose: () => void;
  handleUpdateFood: (food: Food) => Promise<void>;
};

const ModalEditFood = ({ isOpen, editingFood, onRequestClose, handleUpdateFood }: ModalEditFoodProps) => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = async (data: Food) => {
    handleUpdateFood(data);
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalEditFood;
