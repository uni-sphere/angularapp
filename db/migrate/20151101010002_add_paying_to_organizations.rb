class AddPayingToOrganizations < ActiveRecord::Migration
  def change
    add_column :organizations, :paying, :boolean, default: false
  end
end