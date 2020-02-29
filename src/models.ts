/* eslint-disable no-useless-constructor */
export class Service {
  constructor (protected entity: any, protected entities) {}

  getFullTable () {
    return this.entities.find(this.entity);
  }

  getRow (id) {
    return this.entities.findOne(this.entity, id);
  }

  async addRow (rowData) {
    await this.entities.save(this.entity, rowData)
      .catch(err => console.log(err));
  }

  async updateRow (rowData, id) {
    const updatedRow = await this.entities.findOne(this.entity, id);
    for (const col in rowData) {
      if (rowData[col]) {
        updatedRow[col] = rowData[col];
      }
    }
    await this.entities.save(updatedRow);
  }

  async deleteRow (id) {
    await this.entities.delete(this.entity, id);
  }
}
