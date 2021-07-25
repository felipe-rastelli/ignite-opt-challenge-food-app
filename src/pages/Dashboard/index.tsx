import { Component } from 'react';
import { RouteComponentProps } from 'react-router';

import { Food as FoodModel } from '../../types';
import api from '../../services/api';
import Header from '../../components/Header';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

type FoodInput = Omit<FoodModel, 'id | available'>;
interface DashboardProps extends RouteComponentProps {};
interface DashboardState {
  foods: FoodModel[];
  editingFood: FoodModel;
  modalOpen: boolean;
  editModalOpen: boolean;
};

class Dashboard extends Component<DashboardProps, DashboardState> {
  constructor(props: DashboardProps) {
    super(props);
    this.state = {
      foods: [],
      editingFood: {} as FoodModel,
      modalOpen: false,
      editModalOpen: false,
    };
  };

  async componentDidMount() {
    const response = await api.get<FoodModel[]>('/foods');

    this.setState({ foods: response.data });
  };

  handleAddFood = async (food: FoodInput) => {
    const { foods } = this.state;

    try {
      const response = await api.post<FoodModel>('/foods', {
        ...food,
        available: true,
      });

      this.setState({ foods: [...foods, response.data] });
    } catch (err) {
      console.log(err);
    }
  };

  handleUpdateFood = async (food: FoodModel) => {
    const { foods, editingFood } = this.state;

    try {
      const foodUpdated = await api.put<FoodModel>(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      this.setState({ foods: foodsUpdated });
    } catch (err) {
      console.log(err);
    }
  };

  handleDeleteFood = async (id: number) => {
    const { foods } = this.state;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    this.setState({ foods: foodsFiltered });
  };

  toggleModal = () => {
    const { modalOpen } = this.state;

    this.setState({ modalOpen: !modalOpen });
  };

  toggleEditModal = () => {
    const { editModalOpen } = this.state;

    this.setState({ editModalOpen: !editModalOpen });
  };

  handleEditFood = (food: FoodModel) => {
    this.setState({ editingFood: food, editModalOpen: true });
  };

  render() {
    const { modalOpen, editModalOpen, editingFood, foods } = this.state;

    return (
      <>
        <Header openModal={this.toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          onRequestClose={this.toggleModal}
          handleAddFood={this.handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={this.toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={this.handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={this.handleDeleteFood}
                handleEditFood={this.handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
  }
};

export default Dashboard;
