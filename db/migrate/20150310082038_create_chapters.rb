class CreateChapters < ActiveRecord::Migration
  def change
    create_table :chapters do |t|
      t.string :title
      t.integer :node_id
      t.integer :user_id
      t.integer :parent_id

      t.timestamps
    end
  end
end
