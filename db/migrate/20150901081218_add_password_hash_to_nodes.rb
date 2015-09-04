class AddPasswordHashToNodes < ActiveRecord::Migration
  def change
    add_column :nodes, :password_hash, :string
  end
end

