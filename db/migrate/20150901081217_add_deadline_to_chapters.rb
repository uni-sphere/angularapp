class AddDeadlineToChapters < ActiveRecord::Migration
  def change
    add_column :chapters, :deadline, :date
  end
end