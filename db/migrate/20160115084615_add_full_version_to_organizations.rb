class AddFullVersionToOrganizations < ActiveRecord::Migration
  def change
    add_column :organizations, :full_version, :boolean
  end
end
