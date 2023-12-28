import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto.ts';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
    private coffees: Coffee[] = [
        {
            id: 1,
            name: 'Roast',
            brand: 'Brew',
            flavors: ['chocolate', 'vanilla'],
        },
    ];

    findAll() {
        return this.coffees;
    }

    findOne(id: string) {
        const coffee = this.coffees.find((item) => item.id === +id);
        if (!coffee) {
            throw new NotFoundException(`Coffee #{id} not found`);
        }
        return coffee;
    }

    create(createCoffeeDto: CreateCoffeeDto) {
        this.coffees.push(createCoffeeDto);
    }

    update(id: string, body: UpdateCoffeeDto) {
        const existingCoffee = this.findOne(id);
        if (existingCoffee) {
            // TODO: update the existing entity
        }
    }

    remove(id: string) {
        const coffeeIndex = this.coffees.findIndex((item) => item.id === +id);
        if (coffeeIndex >= 0) {
            this.coffees.splice(coffeeIndex, 1);
        }
    }
}
