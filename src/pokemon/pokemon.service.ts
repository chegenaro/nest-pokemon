import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';

@Injectable()
export class PokemonService {

  //? No entiendo bien que es lo que ace el contructor ahi, se que se esta haciendo una inyeccion de dependencias, <Pokemon> esto es un generico
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {
      this.handleExceptions(error)
    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(id: string) {

    let pokemon: Pokemon
    //buscar por nro
    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({ nro: id.toLocaleLowerCase().trim() })
    }


    //Buscar por nombre
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: id.toLocaleLowerCase().trim() })
    }


    //Buscar por mongoId
    if (!pokemon && isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id)
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id, name or no ${id} not found`);
    }

    return pokemon
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    //?el metodo que estamos usando abajo es el mismo que el de arriba, lo utilixamos para no repetir el codigo
    const pokemon = await this.findOne(id);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto);

      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {
      this.handleExceptions(error)
    }

  }

  async remove(id: string) {
    // const Pokemon = await this.findOne(id);
    // await Pokemon.deleteOne();
    //await this.pokemonModel.findByIdAndDelete(id); //?clse 18 seccion 7
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if ( deletedCount === 0 ) {
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    }

    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException('Can\'t create pokemon - Check server logs');
  }
}
