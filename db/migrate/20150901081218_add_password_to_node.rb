class AddPasswordToNodes < ActiveRecord::Migration
  def change
    add_column :nodes, :password, :string
  end
end