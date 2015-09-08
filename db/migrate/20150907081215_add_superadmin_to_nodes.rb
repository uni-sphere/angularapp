class AddSuperadminToNodes < ActiveRecord::Migration
  def change
    add_column :nodes, :superadmin, :boolean, default: false
  end
end