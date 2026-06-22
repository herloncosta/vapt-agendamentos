// Classe base opcional para repositórios in-memory em testes
export class InMemoryBaseRepository<T extends { id: string }> {
  protected items: T[] = [];

  async create(data: T): Promise<T> {
    this.items.push(data);
    return data;
  }

  async findById(id: string): Promise<T | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findAll(): Promise<T[]> {
    return this.items;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.items[index] = { ...this.items[index], ...data };
    return this.items[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }
}
