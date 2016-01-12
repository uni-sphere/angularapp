class CreateAssignments < ActiveRecord::Migration
  def change
    create_table :assignments do |t|
      t.string :title
      t.string :subject, default: ''
      t.integer :count, default: 0
      t.integer :due_date, default: 0
      t.integer :node_id
      t.string :node_name
      t.integer :user_id

      t.timestamps
    end
  end
end
