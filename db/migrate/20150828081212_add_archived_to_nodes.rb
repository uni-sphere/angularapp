class AddArchivedToNodes < ActiveRecord::Migration
  def change
    add_column :nodes, :archived, :boolean, default: false
  end
end