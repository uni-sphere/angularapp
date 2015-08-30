class CreateActions < ActiveRecord::Migration
  def change
    create_table :actions do |t|
      t.integer :user_id
      t.integer :object_id
      t.integer :organization_id
      t.boolean :error, default: false
      t.string :user
      t.string :object
      t.string :name
      t.string :object_type
      
      t.timestamps
    end
  end
end

name: 'created', object_id: @current_node.chapters.last.id, object_type: 'chapter',
 object: @current_node.chapters.last.title, organization_id: @current_organization.id, user_id: current_user.id, user: current_user.email