import { useState, useEffect } from 'react';

import { Food as FoodModel } from '../../types';
import api from '../../services/api';
import Header from '../../components/Header';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

type FoodInput = Omit<FoodModel, 'id | available'>;

const Dashboard = () => {
  const [foods, setFoods] = useState<FoodModel[]>([]);
  const [editingFood, setEditingFood] = useState<FoodModel>({} as FoodModel);
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [isEditFoodModalOpen, setIsEditFoodModalOpen] = useState(false);

  useEffect(() => {
    const fetchFoods = async () => {
      const response = await api.get<FoodModel[]>('/foods');

      setFoods(response.data);
    };

    fetchFoods();
  }, []);

  const handleAddFood = async (food: FoodInput) => {
    try {
      const response = await api.post<FoodModel>('/foods', {
        ...food,
        available: true
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: FoodModel) => {
    try {
      const foodUpdated = await api.put<FoodModel>(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  };

  const toggleAddFoodModal = () => {
    setIsAddFoodModalOpen(!isAddFoodModalOpen);
  };

  const toggleEditFoodModal = () => {
    setIsEditFoodModalOpen(!isEditFoodModalOpen);
  };

  const handleEditFood = (food: FoodModel) => {
    setEditingFood(food);
    setIsEditFoodModalOpen(true);
  };

  return (
    <>
      <Header openModal={toggleAddFoodModal} />
      <ModalAddFood
        isOpen={isAddFoodModalOpen}
        onRequestClose={toggleAddFoodModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditFoodModalOpen}
        onRequestClose={toggleEditFoodModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
