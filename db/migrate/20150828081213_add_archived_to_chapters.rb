class AddArchivedToChapters < ActiveRecord::Migration
  def change
    add_column :chapters, :archived, :boolean, default: false
  end
end