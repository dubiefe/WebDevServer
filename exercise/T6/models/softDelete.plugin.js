
export const softDeletePlugin = (schema) => {
  // Add fields to schema
  schema.add({
    deleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: String, default: null }
  });

  // Método de instancia: soft delete
  schema.methods.softDelete = async function(deletedBy = null) {
    this.deleted = true;
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;
    return this.save();
  };
  
  // Método de instancia: restaurar
  schema.methods.restore = async function() {
    this.deleted = false;
    this.deletedAt = null;
    this.deletedBy = null;
    return this.save();
  };

  // Método estático: soft delete por ID
  schema.statics.softDeleteById = async function(id, deletedBy = null) {
    return this.findByIdAndUpdate(
      id,
      {
        deleted: true,
        deletedAt: new Date(),
        deletedBy
      },
      { new: true }
    ).setOptions({ withDeleted: true });
  };
  
  // Método estático: restaurar por ID
  schema.statics.restoreById = async function(id) {
    return this.findByIdAndUpdate(
      id,
      {
        deleted: false,
        deletedAt: null,
        deletedBy: null
      },
      { new: true }
    ).setOptions({ withDeleted: true });
  };

  // Method to exclude deleted in reading
  const excludeDeleted = function() {
    if (!this.getOptions().withDeleted) {
      this.where({ deleted: { $ne: true } });
    }
  };

  // Método estático: buscar incluyendo eliminados
  schema.statics.findWithDeleted = function(filter = {}) {
    return this.find(filter).setOptions({ withDeleted: true });
  };

}