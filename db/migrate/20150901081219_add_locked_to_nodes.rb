class AddLockedToNodes < ActiveRecord::Migration
  def change
    add_column :nodes, :locked, :boolean, default: false
  end
end