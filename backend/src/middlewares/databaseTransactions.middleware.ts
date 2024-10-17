import mongoose, { ClientSession } from 'mongoose';

export const performTransaction = async (operations: ((session: ClientSession) => Promise<void>)[]) => {

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    for (const operation of operations) {

      await operation(session);

    }

    await session.commitTransaction();

    console.log('Transaction committed successfully');

  } catch (error:any) {

    await session.abortTransaction();

    console.error('Transaction aborted due to an error: ', error);

    throw new Error(`Error creating User: ${error.message}`)

  } finally {

    session.endSession();
    
  }
};
