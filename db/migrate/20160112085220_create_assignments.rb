class CreateAssignments < ActiveRecord::Migration
  def change
    create_table :assignments do |t|
      t.integer :organization_id
      t.integer :node_id
      t.integer :user_id
      t.string :title
      t.string :subject, default: ''
      t.string :due_date
      t.string :node_name
      t.boolean :archived, default: false
      t.timestamps
    end
  end
end
